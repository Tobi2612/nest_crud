import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Company extends Model<Company> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  company_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  location: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  no_of_staff: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  photo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  uid: string;
}
