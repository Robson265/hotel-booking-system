import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { Booking } from "./booking.entities";


@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Booking, (booking) => booking.payment)
    @JoinColumn()
    booking: Booking;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

  // PENDING | PAID | FAILED | REFUNDED
    @Column({ nullable: true })
    transactionId: string;

    @Column({ nullable: true })
    paymentMethod: string; // 'card', 'cash', 'transfer'

    @Column({ nullable: true })
    paidAt: Date;
    
    @CreateDateColumn()
    createdAt: Date;

}