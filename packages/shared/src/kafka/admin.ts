import { Admin } from "kafkajs";
import { createKafkaClient } from "./client";

export const createKafkaAdmin = async(clientId:string): Promise<Admin> => {
    const kafkaClient = createKafkaClient(clientId)
    
    const kafkaAdmin = kafkaClient.admin()

    await kafkaAdmin.connect()
    
    return kafkaAdmin
}