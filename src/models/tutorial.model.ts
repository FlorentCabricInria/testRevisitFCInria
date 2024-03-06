import { RowDataPacket } from 'mysql2';

interface Tutorial extends RowDataPacket {
    id?: number;
    email: string;
    password: string;
    admin: boolean;
    created_at: Date;
}
export default Tutorial;
