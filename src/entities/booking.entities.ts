import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./room.entities";
import { User } from "./users.entities";


@Entity('bookings')

export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.bookings)
    user: User;

    @ManyToOne(() => Room, (room) => room.bookings)
    room: Room;

    @Column('date')
    checkInDate: Date;

    @Column('date')
    checkOutDate: Date;

    @Column('int')
    numberOfGuests: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

  // PENDING | CONFIRMED | CHECKED_IN | CHECKED_OUT | CANCELLED
    @Column('text', { nullable: true })
    specialRequests: string;

    @Column({ nullable: true })
    cancellationReason: string;

    @OneToOne(() => Payment, (payment) => payment.booking)
    payment: Payment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}