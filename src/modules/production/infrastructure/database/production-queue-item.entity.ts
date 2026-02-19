import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductionStatusEnum } from "../../domain/enums/production-status.enum";

@Entity("production_queue_items")
export class ProductionQueueItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", name: "work_order_id", unique: true })
  workOrderId: number;

  @Column({ type: "int", name: "customer_id", nullable: true })
  customerId: number | null;

  @Column({ type: "int", name: "vehicle_id", nullable: true })
  vehicleId: number | null;

  @Column({ type: "varchar", name: "protocol", nullable: true })
  protocol: string | null;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    name: "total_amount",
    nullable: true,
  })
  totalAmount: number | null;

  @Column({
    type: "enum",
    enum: ProductionStatusEnum,
    enumName: "production_queue_status_enum",
    default: ProductionStatusEnum.QUEUED,
  })
  status: ProductionStatusEnum;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({
    type: "timestamp with time zone",
    name: "started_at",
    nullable: true,
  })
  startedAt: Date | null;

  @Column({
    type: "timestamp with time zone",
    name: "completed_at",
    nullable: true,
  })
  completedAt: Date | null;
}
