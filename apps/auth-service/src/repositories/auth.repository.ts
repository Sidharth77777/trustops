import { PoolClient } from "pg"
import { CACHE_USER_PROFILE_KEY_PREFIX, CACHE_USER_TOKEN_VERSION_KEY_PREFIX, getCacheOrFetchFromDB, getPool, getRedisJson, invalidateCache, logger, setRedisExpJson, USER_PROFILE_CACHE_TTL } from "@trustops/shared"
import { AuthUser } from "@trustops/shared"
import { AuthUserRow, MeUser, SiweNonce, SiweNonceRow, UserWallet, UserWalletRow } from "../types/types"
import { DB_TABLES } from "../constants/constants"

export const findUserByEmail = async(email:string): Promise<AuthUser | null> => {
    const result = await getPool().query<AuthUserRow>(
        `SELECT id, email, name, image, role, password_hash, is_email_verified, token_version, two_factor_enabled, two_factor_secret
         FROM ${DB_TABLES.TRUSTOPS_USERS}
         WHERE email = $1;
        `, [email]
    )

    return result.rows[0] ?? null
}

export const findUserById = async(id:string): Promise<AuthUser | null> => {
    const result = await getPool().query<AuthUserRow>(
        `SELECT id, email, name, image, role, password_hash, is_email_verified, token_version, two_factor_enabled, two_factor_secret
         FROM ${DB_TABLES.TRUSTOPS_USERS}
         WHERE id = $1;
        `, [id]
    )

    return result.rows[0] ?? null
}

export const findMeUserById = async(id: string): Promise<MeUser | null> => {

    const redisKey = `${CACHE_USER_PROFILE_KEY_PREFIX}${id}`

    return getCacheOrFetchFromDB<MeUser>({
        redisKey,
        ttl: USER_PROFILE_CACHE_TTL,
        getCache: (redisKey) => getRedisJson<MeUser>(redisKey),
        fetchDataFromDB: async() => {
            const result = await getPool().query<MeUser>(
                `SELECT id, email, name, image, role, is_email_verified, two_factor_enabled, created_at, updated_at
                FROM ${DB_TABLES.TRUSTOPS_USERS}
                WHERE id = $1;
                `, [id]
            )
            return result.rows[0] ?? null
        },
        setCache: (redisKey, value, ttl) =>
            setRedisExpJson(redisKey, value, ttl),
        logContext: { userId: id }
    })

}

export const findUserByGoogleId = async (googleId: string): Promise<AuthUser | null> => {
    const result = await getPool().query<AuthUserRow>(
        `
        SELECT id, email, name, image, role, password_hash, is_email_verified, google_id, token_version, two_factor_enabled, two_factor_secret
        FROM ${DB_TABLES.TRUSTOPS_USERS}
        WHERE google_id = $1;
        `,
        [googleId]
    )

    return result.rows[0] ?? null
}

export const findUserByVerificationToken = async(hash:string): Promise<AuthUser | null> => {
    const result = await getPool().query<AuthUser>(
        `SELECT id, email, name, image, role, is_email_verified
         FROM ${DB_TABLES.TRUSTOPS_USERS}
         WHERE email_verification_token_hash = $1;
        `, [hash]
    )

    return result.rows[0] ?? null

}

export const storeEmailVerificationTokenHash = async(client:PoolClient, hash:string, id:string) => { 
   await client.query<AuthUserRow>(
        `UPDATE ${DB_TABLES.TRUSTOPS_USERS}
         SET 
            email_verification_token_hash = $1,
            updated_at = NOW()
         WHERE id = $2;
        `, [hash, id]
    )

}

export const markEmailAsVerified = async(id:string): Promise<AuthUser> => {
    const result = await getPool().query<AuthUserRow>(
        `UPDATE ${DB_TABLES.TRUSTOPS_USERS}
         SET 
            is_email_verified = TRUE,
            email_verification_token_hash = NULL,
            token_version = token_version + 1,
            updated_at = NOW()
         WHERE id = $1
         RETURNING id, email, name, role, password_hash, is_email_verified, token_version, two_factor_enabled;
        `, [id]
    )
  
    await invalidateCache(CACHE_USER_TOKEN_VERSION_KEY_PREFIX, id, "Failed to invalidate token version cache")
    await invalidateCache(CACHE_USER_PROFILE_KEY_PREFIX, id, "Failed to invalidate user profile cache")
    
    return result.rows[0]
}

export const incrementTokenVersion = async (id: string): Promise<number> => {
    const result = await getPool().query(
        `
        UPDATE ${DB_TABLES.TRUSTOPS_USERS}
        SET
            token_version = token_version + 1,
            updated_at = NOW()
        WHERE id = $1
        RETURNING token_version;
        `, [id]
    )

    if (!result.rows[0]) {
        throw new Error("Failed to increment token version")
    }

    await invalidateCache(CACHE_USER_TOKEN_VERSION_KEY_PREFIX, id, "Failed to invalidate token version cache")

    return Number(result.rows[0].token_version)

};

export const createUser = async(client:PoolClient, email:string, name:string, passwordHash:string): Promise<AuthUser> => {
    const result = await client.query<AuthUserRow>(
        `INSERT INTO ${DB_TABLES.TRUSTOPS_USERS} (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, role, is_email_verified, two_factor_enabled, token_version, created_at;
        `, [email, name, passwordHash]
    )

    return result.rows[0]
}

export const updateForgotPassword = async(client:PoolClient, email:string, tokenHash:string, resetPasswordExpires:Date): Promise<void> => {
    await client.query(
        `UPDATE ${DB_TABLES.TRUSTOPS_USERS}
         SET 
            reset_token_hash = $1,
            reset_password_expires = $2
        WHERE email = $3;
        `, [tokenHash, resetPasswordExpires, email]
    )
    
}

export const findUserByResetTokenHash = async(hash:string): Promise<AuthUser | null> => {
    const result = await getPool().query<AuthUserRow>(
        `SELECT id, email, name, role, is_email_verified, reset_password_expires, password_hash
         FROM ${DB_TABLES.TRUSTOPS_USERS}
         WHERE reset_token_hash = $1;
        `, [hash]
    )

    return result.rows[0] ?? null
}

export const resetPasswordById = async(hash:string, id:string): Promise<void> => {
    const result = await getPool().query(
        `UPDATE ${DB_TABLES.TRUSTOPS_USERS}
         SET 
            password_hash = $1,
            reset_token_hash = NULL,
            reset_password_expires = NULL,
            token_version = token_version + 1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING token_version;
        `, [hash, id]
    )

    if (!result.rows[0]) {
        throw new Error("Failed to reset password")
    }

    await invalidateCache(CACHE_USER_TOKEN_VERSION_KEY_PREFIX, id, "Failed to invalidate token version cache")

}

export const createNewUserFromGoogle = async(email:string, name:string, hash:string, picture:string, googleId: string): Promise<AuthUser> => {
    const result = await getPool().query<AuthUserRow>(
        `INSERT INTO ${DB_TABLES.TRUSTOPS_USERS} (email, name, password_hash, image, google_id, is_email_verified)
         VALUES ($1, $2, $3, $4, $5, TRUE)
         RETURNING id, email, name, role, password_hash, is_email_verified, token_version, two_factor_enabled, two_factor_secret;
        `, [email, name, hash, picture, googleId]
    )

    return result.rows[0]
}

export const linkGoogleAccount = async(id: string, googleId: string): Promise<void> => {
    await getPool().query(
        `
        UPDATE ${DB_TABLES.TRUSTOPS_USERS}
        SET
            google_id = $1,
            is_email_verified = TRUE,
            updated_at = NOW()
        WHERE id = $2;
        `, [googleId, id]
    )

     await invalidateCache(CACHE_USER_PROFILE_KEY_PREFIX, id, "Failed to invalidate user profile cache")
}

export const markTwoFA = async(secret:string, userId:string) => {
    await getPool().query<AuthUserRow>(
        `UPDATE ${DB_TABLES.TRUSTOPS_USERS}
         SET two_factor_secret = $1
         WHERE id = $2;
        `, [secret, userId]
    )


}

export const mark2FaAsEnabled = async(userId:string) => {
    await getPool().query<AuthUserRow>(
        `UPDATE ${DB_TABLES.TRUSTOPS_USERS}
         SET 
            two_factor_enabled = TRUE,
            token_version = token_version + 1,
            updated_at = NOW()
         WHERE id = $1;
        `, [userId]
    )

    await invalidateCache(CACHE_USER_TOKEN_VERSION_KEY_PREFIX, userId, "Failed to invalidate token version cache")
    await invalidateCache(CACHE_USER_PROFILE_KEY_PREFIX, userId, "Failed to invalidate user profile cache")

}

export const createNonce = async(address:string, nonce:string, expiresAt:Date): Promise<SiweNonce | null> => {
    const result = await getPool().query<SiweNonceRow>(
        `INSERT INTO ${DB_TABLES.TRUSTOPS_SIWE_NONCES} (address, nonce, expires_at)
         VALUES ($1, $2, $3)
         RETURNING id, address, nonce, expires_at, created_at;
        `, [address, nonce, expiresAt]
    )

    return result.rows[0] ?? null
}

export const findNonce = async(address:string, nonce:string): Promise<SiweNonce | null> => {
    const result = await getPool().query<SiweNonceRow>(
        `SELECT id, address, nonce, expires_at, created_at
         FROM ${DB_TABLES.TRUSTOPS_SIWE_NONCES}
         WHERE address = $1 AND nonce = $2 AND expires_at > NOW();
        `, [address, nonce]
    )

    if (result.rows.length === 0) {
        try {
            await getPool().query<SiweNonceRow>(
                `DELETE FROM ${DB_TABLES.TRUSTOPS_SIWE_NONCES}
                 WHERE address = $1 AND nonce = $2 AND expires_at <= NOW();;`,
                 [address, nonce]
            )
        } catch (error) {
            logger.error(
                { error, address },
                "Failed to delete expired SIWE nonce"
            )
        }
    }

    return result.rows[0]
}

export const deleteNonce = async(id:string) => {
    await getPool().query(
        `DELETE FROM ${DB_TABLES.TRUSTOPS_SIWE_NONCES}
         WHERE id = $1;
        `, [id]
    )
}

export const findUserByWalletAddress = async(address:string): Promise<UserWallet | null> => {
    const result = await getPool().query<UserWalletRow>(
        `SELECT id, user_id, address, created_at
         FROM ${DB_TABLES.TRUSTOPS_USER_WALLETS}
         WHERE address = $1;
        `, [address]
    )

    return result.rows[0] ?? null
}

export const createUserByWalletAddress = async(client:PoolClient): Promise<string | null> => {
    const result = await client.query<AuthUserRow>(
        `INSERT INTO ${DB_TABLES.TRUSTOPS_USERS} DEFAULT VALUES
         RETURNING id;
        `
    )

    return result.rows[0].id ?? null
}

export const findWalletByUserId = async(userId:string): Promise<UserWallet | null> => {
    const result = await getPool().query<UserWalletRow>(
        `SELECT id, user_id, address, created_at
         FROM ${DB_TABLES.TRUSTOPS_USER_WALLETS}
         WHERE user_id = $1;
        `, [userId]
    )

    return result.rows[0] ?? null
}

export const createUserWallet = async(client:PoolClient, userId:string, address:string): Promise<UserWallet | null> => {
    const result = await client.query<UserWalletRow>(
        `INSERT INTO ${DB_TABLES.TRUSTOPS_USER_WALLETS} (user_id, address)
         VALUES ($1, $2)
         RETURNING id, user_id, address, created_at;
        `, [userId, address]
    )

    return result.rows[0] ?? null
}

export const updateUserEmail = async(client:PoolClient, userId:string, email:string): Promise<void> => {
    await client.query(
        `UPDATE ${DB_TABLES.TRUSTOPS_USERS}
         SET email = $1, updated_at = NOW()
         WHERE id = $2;
        `, [userId, email]
    )

    await invalidateCache(CACHE_USER_PROFILE_KEY_PREFIX, userId, "Failed to invalidate user profile cache")
    
}
