import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WarehouseLocationModel = runtime.Types.Result.DefaultSelection<Prisma.$WarehouseLocationPayload>;
export type AggregateWarehouseLocation = {
    _count: WarehouseLocationCountAggregateOutputType | null;
    _min: WarehouseLocationMinAggregateOutputType | null;
    _max: WarehouseLocationMaxAggregateOutputType | null;
};
export type WarehouseLocationMinAggregateOutputType = {
    id: string | null;
    warehouseId: string | null;
    code: string | null;
    type: $Enums.LocationType | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WarehouseLocationMaxAggregateOutputType = {
    id: string | null;
    warehouseId: string | null;
    code: string | null;
    type: $Enums.LocationType | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WarehouseLocationCountAggregateOutputType = {
    id: number;
    warehouseId: number;
    code: number;
    type: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type WarehouseLocationMinAggregateInputType = {
    id?: true;
    warehouseId?: true;
    code?: true;
    type?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WarehouseLocationMaxAggregateInputType = {
    id?: true;
    warehouseId?: true;
    code?: true;
    type?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WarehouseLocationCountAggregateInputType = {
    id?: true;
    warehouseId?: true;
    code?: true;
    type?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type WarehouseLocationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WarehouseLocationWhereInput;
    orderBy?: Prisma.WarehouseLocationOrderByWithRelationInput | Prisma.WarehouseLocationOrderByWithRelationInput[];
    cursor?: Prisma.WarehouseLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WarehouseLocationCountAggregateInputType;
    _min?: WarehouseLocationMinAggregateInputType;
    _max?: WarehouseLocationMaxAggregateInputType;
};
export type GetWarehouseLocationAggregateType<T extends WarehouseLocationAggregateArgs> = {
    [P in keyof T & keyof AggregateWarehouseLocation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWarehouseLocation[P]> : Prisma.GetScalarType<T[P], AggregateWarehouseLocation[P]>;
};
export type WarehouseLocationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WarehouseLocationWhereInput;
    orderBy?: Prisma.WarehouseLocationOrderByWithAggregationInput | Prisma.WarehouseLocationOrderByWithAggregationInput[];
    by: Prisma.WarehouseLocationScalarFieldEnum[] | Prisma.WarehouseLocationScalarFieldEnum;
    having?: Prisma.WarehouseLocationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WarehouseLocationCountAggregateInputType | true;
    _min?: WarehouseLocationMinAggregateInputType;
    _max?: WarehouseLocationMaxAggregateInputType;
};
export type WarehouseLocationGroupByOutputType = {
    id: string;
    warehouseId: string;
    code: string;
    type: $Enums.LocationType;
    createdAt: Date;
    updatedAt: Date;
    _count: WarehouseLocationCountAggregateOutputType | null;
    _min: WarehouseLocationMinAggregateOutputType | null;
    _max: WarehouseLocationMaxAggregateOutputType | null;
};
export type GetWarehouseLocationGroupByPayload<T extends WarehouseLocationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WarehouseLocationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WarehouseLocationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WarehouseLocationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WarehouseLocationGroupByOutputType[P]>;
}>>;
export type WarehouseLocationWhereInput = {
    AND?: Prisma.WarehouseLocationWhereInput | Prisma.WarehouseLocationWhereInput[];
    OR?: Prisma.WarehouseLocationWhereInput[];
    NOT?: Prisma.WarehouseLocationWhereInput | Prisma.WarehouseLocationWhereInput[];
    id?: Prisma.StringFilter<"WarehouseLocation"> | string;
    warehouseId?: Prisma.StringFilter<"WarehouseLocation"> | string;
    code?: Prisma.StringFilter<"WarehouseLocation"> | string;
    type?: Prisma.EnumLocationTypeFilter<"WarehouseLocation"> | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFilter<"WarehouseLocation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WarehouseLocation"> | Date | string;
    warehouse?: Prisma.XOR<Prisma.WarehouseScalarRelationFilter, Prisma.WarehouseWhereInput>;
    inventory?: Prisma.InventoryListRelationFilter;
    outgoing?: Prisma.StockMovementListRelationFilter;
    incoming?: Prisma.StockMovementListRelationFilter;
};
export type WarehouseLocationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    warehouseId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    warehouse?: Prisma.WarehouseOrderByWithRelationInput;
    inventory?: Prisma.InventoryOrderByRelationAggregateInput;
    outgoing?: Prisma.StockMovementOrderByRelationAggregateInput;
    incoming?: Prisma.StockMovementOrderByRelationAggregateInput;
};
export type WarehouseLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    warehouseId_code?: Prisma.WarehouseLocationWarehouseIdCodeCompoundUniqueInput;
    AND?: Prisma.WarehouseLocationWhereInput | Prisma.WarehouseLocationWhereInput[];
    OR?: Prisma.WarehouseLocationWhereInput[];
    NOT?: Prisma.WarehouseLocationWhereInput | Prisma.WarehouseLocationWhereInput[];
    warehouseId?: Prisma.StringFilter<"WarehouseLocation"> | string;
    code?: Prisma.StringFilter<"WarehouseLocation"> | string;
    type?: Prisma.EnumLocationTypeFilter<"WarehouseLocation"> | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFilter<"WarehouseLocation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WarehouseLocation"> | Date | string;
    warehouse?: Prisma.XOR<Prisma.WarehouseScalarRelationFilter, Prisma.WarehouseWhereInput>;
    inventory?: Prisma.InventoryListRelationFilter;
    outgoing?: Prisma.StockMovementListRelationFilter;
    incoming?: Prisma.StockMovementListRelationFilter;
}, "id" | "warehouseId_code">;
export type WarehouseLocationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    warehouseId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.WarehouseLocationCountOrderByAggregateInput;
    _max?: Prisma.WarehouseLocationMaxOrderByAggregateInput;
    _min?: Prisma.WarehouseLocationMinOrderByAggregateInput;
};
export type WarehouseLocationScalarWhereWithAggregatesInput = {
    AND?: Prisma.WarehouseLocationScalarWhereWithAggregatesInput | Prisma.WarehouseLocationScalarWhereWithAggregatesInput[];
    OR?: Prisma.WarehouseLocationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WarehouseLocationScalarWhereWithAggregatesInput | Prisma.WarehouseLocationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WarehouseLocation"> | string;
    warehouseId?: Prisma.StringWithAggregatesFilter<"WarehouseLocation"> | string;
    code?: Prisma.StringWithAggregatesFilter<"WarehouseLocation"> | string;
    type?: Prisma.EnumLocationTypeWithAggregatesFilter<"WarehouseLocation"> | $Enums.LocationType;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WarehouseLocation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"WarehouseLocation"> | Date | string;
};
export type WarehouseLocationCreateInput = {
    id?: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    warehouse: Prisma.WarehouseCreateNestedOneWithoutLocationsInput;
    inventory?: Prisma.InventoryCreateNestedManyWithoutLocationInput;
    outgoing?: Prisma.StockMovementCreateNestedManyWithoutFromLocationInput;
    incoming?: Prisma.StockMovementCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationUncheckedCreateInput = {
    id?: string;
    warehouseId: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: Prisma.InventoryUncheckedCreateNestedManyWithoutLocationInput;
    outgoing?: Prisma.StockMovementUncheckedCreateNestedManyWithoutFromLocationInput;
    incoming?: Prisma.StockMovementUncheckedCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    warehouse?: Prisma.WarehouseUpdateOneRequiredWithoutLocationsNestedInput;
    inventory?: Prisma.InventoryUpdateManyWithoutLocationNestedInput;
    outgoing?: Prisma.StockMovementUpdateManyWithoutFromLocationNestedInput;
    incoming?: Prisma.StockMovementUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouseId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: Prisma.InventoryUncheckedUpdateManyWithoutLocationNestedInput;
    outgoing?: Prisma.StockMovementUncheckedUpdateManyWithoutFromLocationNestedInput;
    incoming?: Prisma.StockMovementUncheckedUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationCreateManyInput = {
    id?: string;
    warehouseId: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WarehouseLocationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WarehouseLocationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouseId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WarehouseLocationListRelationFilter = {
    every?: Prisma.WarehouseLocationWhereInput;
    some?: Prisma.WarehouseLocationWhereInput;
    none?: Prisma.WarehouseLocationWhereInput;
};
export type WarehouseLocationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WarehouseLocationWarehouseIdCodeCompoundUniqueInput = {
    warehouseId: string;
    code: string;
};
export type WarehouseLocationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouseId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WarehouseLocationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouseId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WarehouseLocationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouseId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WarehouseLocationScalarRelationFilter = {
    is?: Prisma.WarehouseLocationWhereInput;
    isNot?: Prisma.WarehouseLocationWhereInput;
};
export type WarehouseLocationNullableScalarRelationFilter = {
    is?: Prisma.WarehouseLocationWhereInput | null;
    isNot?: Prisma.WarehouseLocationWhereInput | null;
};
export type WarehouseLocationCreateNestedManyWithoutWarehouseInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput> | Prisma.WarehouseLocationCreateWithoutWarehouseInput[] | Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput[];
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput | Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput[];
    createMany?: Prisma.WarehouseLocationCreateManyWarehouseInputEnvelope;
    connect?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
};
export type WarehouseLocationUncheckedCreateNestedManyWithoutWarehouseInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput> | Prisma.WarehouseLocationCreateWithoutWarehouseInput[] | Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput[];
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput | Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput[];
    createMany?: Prisma.WarehouseLocationCreateManyWarehouseInputEnvelope;
    connect?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
};
export type WarehouseLocationUpdateManyWithoutWarehouseNestedInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput> | Prisma.WarehouseLocationCreateWithoutWarehouseInput[] | Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput[];
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput | Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput[];
    upsert?: Prisma.WarehouseLocationUpsertWithWhereUniqueWithoutWarehouseInput | Prisma.WarehouseLocationUpsertWithWhereUniqueWithoutWarehouseInput[];
    createMany?: Prisma.WarehouseLocationCreateManyWarehouseInputEnvelope;
    set?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    disconnect?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    delete?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    connect?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    update?: Prisma.WarehouseLocationUpdateWithWhereUniqueWithoutWarehouseInput | Prisma.WarehouseLocationUpdateWithWhereUniqueWithoutWarehouseInput[];
    updateMany?: Prisma.WarehouseLocationUpdateManyWithWhereWithoutWarehouseInput | Prisma.WarehouseLocationUpdateManyWithWhereWithoutWarehouseInput[];
    deleteMany?: Prisma.WarehouseLocationScalarWhereInput | Prisma.WarehouseLocationScalarWhereInput[];
};
export type WarehouseLocationUncheckedUpdateManyWithoutWarehouseNestedInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput> | Prisma.WarehouseLocationCreateWithoutWarehouseInput[] | Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput[];
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput | Prisma.WarehouseLocationCreateOrConnectWithoutWarehouseInput[];
    upsert?: Prisma.WarehouseLocationUpsertWithWhereUniqueWithoutWarehouseInput | Prisma.WarehouseLocationUpsertWithWhereUniqueWithoutWarehouseInput[];
    createMany?: Prisma.WarehouseLocationCreateManyWarehouseInputEnvelope;
    set?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    disconnect?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    delete?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    connect?: Prisma.WarehouseLocationWhereUniqueInput | Prisma.WarehouseLocationWhereUniqueInput[];
    update?: Prisma.WarehouseLocationUpdateWithWhereUniqueWithoutWarehouseInput | Prisma.WarehouseLocationUpdateWithWhereUniqueWithoutWarehouseInput[];
    updateMany?: Prisma.WarehouseLocationUpdateManyWithWhereWithoutWarehouseInput | Prisma.WarehouseLocationUpdateManyWithWhereWithoutWarehouseInput[];
    deleteMany?: Prisma.WarehouseLocationScalarWhereInput | Prisma.WarehouseLocationScalarWhereInput[];
};
export type EnumLocationTypeFieldUpdateOperationsInput = {
    set?: $Enums.LocationType;
};
export type WarehouseLocationCreateNestedOneWithoutInventoryInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutInventoryInput, Prisma.WarehouseLocationUncheckedCreateWithoutInventoryInput>;
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutInventoryInput;
    connect?: Prisma.WarehouseLocationWhereUniqueInput;
};
export type WarehouseLocationUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutInventoryInput, Prisma.WarehouseLocationUncheckedCreateWithoutInventoryInput>;
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutInventoryInput;
    upsert?: Prisma.WarehouseLocationUpsertWithoutInventoryInput;
    connect?: Prisma.WarehouseLocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WarehouseLocationUpdateToOneWithWhereWithoutInventoryInput, Prisma.WarehouseLocationUpdateWithoutInventoryInput>, Prisma.WarehouseLocationUncheckedUpdateWithoutInventoryInput>;
};
export type WarehouseLocationCreateNestedOneWithoutOutgoingInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutOutgoingInput, Prisma.WarehouseLocationUncheckedCreateWithoutOutgoingInput>;
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutOutgoingInput;
    connect?: Prisma.WarehouseLocationWhereUniqueInput;
};
export type WarehouseLocationCreateNestedOneWithoutIncomingInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutIncomingInput, Prisma.WarehouseLocationUncheckedCreateWithoutIncomingInput>;
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutIncomingInput;
    connect?: Prisma.WarehouseLocationWhereUniqueInput;
};
export type WarehouseLocationUpdateOneWithoutOutgoingNestedInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutOutgoingInput, Prisma.WarehouseLocationUncheckedCreateWithoutOutgoingInput>;
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutOutgoingInput;
    upsert?: Prisma.WarehouseLocationUpsertWithoutOutgoingInput;
    disconnect?: Prisma.WarehouseLocationWhereInput | boolean;
    delete?: Prisma.WarehouseLocationWhereInput | boolean;
    connect?: Prisma.WarehouseLocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WarehouseLocationUpdateToOneWithWhereWithoutOutgoingInput, Prisma.WarehouseLocationUpdateWithoutOutgoingInput>, Prisma.WarehouseLocationUncheckedUpdateWithoutOutgoingInput>;
};
export type WarehouseLocationUpdateOneWithoutIncomingNestedInput = {
    create?: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutIncomingInput, Prisma.WarehouseLocationUncheckedCreateWithoutIncomingInput>;
    connectOrCreate?: Prisma.WarehouseLocationCreateOrConnectWithoutIncomingInput;
    upsert?: Prisma.WarehouseLocationUpsertWithoutIncomingInput;
    disconnect?: Prisma.WarehouseLocationWhereInput | boolean;
    delete?: Prisma.WarehouseLocationWhereInput | boolean;
    connect?: Prisma.WarehouseLocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WarehouseLocationUpdateToOneWithWhereWithoutIncomingInput, Prisma.WarehouseLocationUpdateWithoutIncomingInput>, Prisma.WarehouseLocationUncheckedUpdateWithoutIncomingInput>;
};
export type WarehouseLocationCreateWithoutWarehouseInput = {
    id?: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: Prisma.InventoryCreateNestedManyWithoutLocationInput;
    outgoing?: Prisma.StockMovementCreateNestedManyWithoutFromLocationInput;
    incoming?: Prisma.StockMovementCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationUncheckedCreateWithoutWarehouseInput = {
    id?: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: Prisma.InventoryUncheckedCreateNestedManyWithoutLocationInput;
    outgoing?: Prisma.StockMovementUncheckedCreateNestedManyWithoutFromLocationInput;
    incoming?: Prisma.StockMovementUncheckedCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationCreateOrConnectWithoutWarehouseInput = {
    where: Prisma.WarehouseLocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput>;
};
export type WarehouseLocationCreateManyWarehouseInputEnvelope = {
    data: Prisma.WarehouseLocationCreateManyWarehouseInput | Prisma.WarehouseLocationCreateManyWarehouseInput[];
    skipDuplicates?: boolean;
};
export type WarehouseLocationUpsertWithWhereUniqueWithoutWarehouseInput = {
    where: Prisma.WarehouseLocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedUpdateWithoutWarehouseInput>;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedCreateWithoutWarehouseInput>;
};
export type WarehouseLocationUpdateWithWhereUniqueWithoutWarehouseInput = {
    where: Prisma.WarehouseLocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutWarehouseInput, Prisma.WarehouseLocationUncheckedUpdateWithoutWarehouseInput>;
};
export type WarehouseLocationUpdateManyWithWhereWithoutWarehouseInput = {
    where: Prisma.WarehouseLocationScalarWhereInput;
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateManyMutationInput, Prisma.WarehouseLocationUncheckedUpdateManyWithoutWarehouseInput>;
};
export type WarehouseLocationScalarWhereInput = {
    AND?: Prisma.WarehouseLocationScalarWhereInput | Prisma.WarehouseLocationScalarWhereInput[];
    OR?: Prisma.WarehouseLocationScalarWhereInput[];
    NOT?: Prisma.WarehouseLocationScalarWhereInput | Prisma.WarehouseLocationScalarWhereInput[];
    id?: Prisma.StringFilter<"WarehouseLocation"> | string;
    warehouseId?: Prisma.StringFilter<"WarehouseLocation"> | string;
    code?: Prisma.StringFilter<"WarehouseLocation"> | string;
    type?: Prisma.EnumLocationTypeFilter<"WarehouseLocation"> | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFilter<"WarehouseLocation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WarehouseLocation"> | Date | string;
};
export type WarehouseLocationCreateWithoutInventoryInput = {
    id?: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    warehouse: Prisma.WarehouseCreateNestedOneWithoutLocationsInput;
    outgoing?: Prisma.StockMovementCreateNestedManyWithoutFromLocationInput;
    incoming?: Prisma.StockMovementCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationUncheckedCreateWithoutInventoryInput = {
    id?: string;
    warehouseId: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    outgoing?: Prisma.StockMovementUncheckedCreateNestedManyWithoutFromLocationInput;
    incoming?: Prisma.StockMovementUncheckedCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationCreateOrConnectWithoutInventoryInput = {
    where: Prisma.WarehouseLocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutInventoryInput, Prisma.WarehouseLocationUncheckedCreateWithoutInventoryInput>;
};
export type WarehouseLocationUpsertWithoutInventoryInput = {
    update: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutInventoryInput, Prisma.WarehouseLocationUncheckedUpdateWithoutInventoryInput>;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutInventoryInput, Prisma.WarehouseLocationUncheckedCreateWithoutInventoryInput>;
    where?: Prisma.WarehouseLocationWhereInput;
};
export type WarehouseLocationUpdateToOneWithWhereWithoutInventoryInput = {
    where?: Prisma.WarehouseLocationWhereInput;
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutInventoryInput, Prisma.WarehouseLocationUncheckedUpdateWithoutInventoryInput>;
};
export type WarehouseLocationUpdateWithoutInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    warehouse?: Prisma.WarehouseUpdateOneRequiredWithoutLocationsNestedInput;
    outgoing?: Prisma.StockMovementUpdateManyWithoutFromLocationNestedInput;
    incoming?: Prisma.StockMovementUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationUncheckedUpdateWithoutInventoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouseId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    outgoing?: Prisma.StockMovementUncheckedUpdateManyWithoutFromLocationNestedInput;
    incoming?: Prisma.StockMovementUncheckedUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationCreateWithoutOutgoingInput = {
    id?: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    warehouse: Prisma.WarehouseCreateNestedOneWithoutLocationsInput;
    inventory?: Prisma.InventoryCreateNestedManyWithoutLocationInput;
    incoming?: Prisma.StockMovementCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationUncheckedCreateWithoutOutgoingInput = {
    id?: string;
    warehouseId: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: Prisma.InventoryUncheckedCreateNestedManyWithoutLocationInput;
    incoming?: Prisma.StockMovementUncheckedCreateNestedManyWithoutToLocationInput;
};
export type WarehouseLocationCreateOrConnectWithoutOutgoingInput = {
    where: Prisma.WarehouseLocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutOutgoingInput, Prisma.WarehouseLocationUncheckedCreateWithoutOutgoingInput>;
};
export type WarehouseLocationCreateWithoutIncomingInput = {
    id?: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    warehouse: Prisma.WarehouseCreateNestedOneWithoutLocationsInput;
    inventory?: Prisma.InventoryCreateNestedManyWithoutLocationInput;
    outgoing?: Prisma.StockMovementCreateNestedManyWithoutFromLocationInput;
};
export type WarehouseLocationUncheckedCreateWithoutIncomingInput = {
    id?: string;
    warehouseId: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: Prisma.InventoryUncheckedCreateNestedManyWithoutLocationInput;
    outgoing?: Prisma.StockMovementUncheckedCreateNestedManyWithoutFromLocationInput;
};
export type WarehouseLocationCreateOrConnectWithoutIncomingInput = {
    where: Prisma.WarehouseLocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutIncomingInput, Prisma.WarehouseLocationUncheckedCreateWithoutIncomingInput>;
};
export type WarehouseLocationUpsertWithoutOutgoingInput = {
    update: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutOutgoingInput, Prisma.WarehouseLocationUncheckedUpdateWithoutOutgoingInput>;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutOutgoingInput, Prisma.WarehouseLocationUncheckedCreateWithoutOutgoingInput>;
    where?: Prisma.WarehouseLocationWhereInput;
};
export type WarehouseLocationUpdateToOneWithWhereWithoutOutgoingInput = {
    where?: Prisma.WarehouseLocationWhereInput;
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutOutgoingInput, Prisma.WarehouseLocationUncheckedUpdateWithoutOutgoingInput>;
};
export type WarehouseLocationUpdateWithoutOutgoingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    warehouse?: Prisma.WarehouseUpdateOneRequiredWithoutLocationsNestedInput;
    inventory?: Prisma.InventoryUpdateManyWithoutLocationNestedInput;
    incoming?: Prisma.StockMovementUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationUncheckedUpdateWithoutOutgoingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouseId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: Prisma.InventoryUncheckedUpdateManyWithoutLocationNestedInput;
    incoming?: Prisma.StockMovementUncheckedUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationUpsertWithoutIncomingInput = {
    update: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutIncomingInput, Prisma.WarehouseLocationUncheckedUpdateWithoutIncomingInput>;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateWithoutIncomingInput, Prisma.WarehouseLocationUncheckedCreateWithoutIncomingInput>;
    where?: Prisma.WarehouseLocationWhereInput;
};
export type WarehouseLocationUpdateToOneWithWhereWithoutIncomingInput = {
    where?: Prisma.WarehouseLocationWhereInput;
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateWithoutIncomingInput, Prisma.WarehouseLocationUncheckedUpdateWithoutIncomingInput>;
};
export type WarehouseLocationUpdateWithoutIncomingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    warehouse?: Prisma.WarehouseUpdateOneRequiredWithoutLocationsNestedInput;
    inventory?: Prisma.InventoryUpdateManyWithoutLocationNestedInput;
    outgoing?: Prisma.StockMovementUpdateManyWithoutFromLocationNestedInput;
};
export type WarehouseLocationUncheckedUpdateWithoutIncomingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouseId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: Prisma.InventoryUncheckedUpdateManyWithoutLocationNestedInput;
    outgoing?: Prisma.StockMovementUncheckedUpdateManyWithoutFromLocationNestedInput;
};
export type WarehouseLocationCreateManyWarehouseInput = {
    id?: string;
    code: string;
    type?: $Enums.LocationType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WarehouseLocationUpdateWithoutWarehouseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: Prisma.InventoryUpdateManyWithoutLocationNestedInput;
    outgoing?: Prisma.StockMovementUpdateManyWithoutFromLocationNestedInput;
    incoming?: Prisma.StockMovementUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationUncheckedUpdateWithoutWarehouseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: Prisma.InventoryUncheckedUpdateManyWithoutLocationNestedInput;
    outgoing?: Prisma.StockMovementUncheckedUpdateManyWithoutFromLocationNestedInput;
    incoming?: Prisma.StockMovementUncheckedUpdateManyWithoutToLocationNestedInput;
};
export type WarehouseLocationUncheckedUpdateManyWithoutWarehouseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumLocationTypeFieldUpdateOperationsInput | $Enums.LocationType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WarehouseLocationCountOutputType = {
    inventory: number;
    outgoing: number;
    incoming: number;
};
export type WarehouseLocationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inventory?: boolean | WarehouseLocationCountOutputTypeCountInventoryArgs;
    outgoing?: boolean | WarehouseLocationCountOutputTypeCountOutgoingArgs;
    incoming?: boolean | WarehouseLocationCountOutputTypeCountIncomingArgs;
};
export type WarehouseLocationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationCountOutputTypeSelect<ExtArgs> | null;
};
export type WarehouseLocationCountOutputTypeCountInventoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryWhereInput;
};
export type WarehouseLocationCountOutputTypeCountOutgoingArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
};
export type WarehouseLocationCountOutputTypeCountIncomingArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
};
export type WarehouseLocationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouseId?: boolean;
    code?: boolean;
    type?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    warehouse?: boolean | Prisma.WarehouseDefaultArgs<ExtArgs>;
    inventory?: boolean | Prisma.WarehouseLocation$inventoryArgs<ExtArgs>;
    outgoing?: boolean | Prisma.WarehouseLocation$outgoingArgs<ExtArgs>;
    incoming?: boolean | Prisma.WarehouseLocation$incomingArgs<ExtArgs>;
    _count?: boolean | Prisma.WarehouseLocationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouseLocation"]>;
export type WarehouseLocationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouseId?: boolean;
    code?: boolean;
    type?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    warehouse?: boolean | Prisma.WarehouseDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouseLocation"]>;
export type WarehouseLocationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouseId?: boolean;
    code?: boolean;
    type?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    warehouse?: boolean | Prisma.WarehouseDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouseLocation"]>;
export type WarehouseLocationSelectScalar = {
    id?: boolean;
    warehouseId?: boolean;
    code?: boolean;
    type?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type WarehouseLocationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "warehouseId" | "code" | "type" | "createdAt" | "updatedAt", ExtArgs["result"]["warehouseLocation"]>;
export type WarehouseLocationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    warehouse?: boolean | Prisma.WarehouseDefaultArgs<ExtArgs>;
    inventory?: boolean | Prisma.WarehouseLocation$inventoryArgs<ExtArgs>;
    outgoing?: boolean | Prisma.WarehouseLocation$outgoingArgs<ExtArgs>;
    incoming?: boolean | Prisma.WarehouseLocation$incomingArgs<ExtArgs>;
    _count?: boolean | Prisma.WarehouseLocationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type WarehouseLocationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    warehouse?: boolean | Prisma.WarehouseDefaultArgs<ExtArgs>;
};
export type WarehouseLocationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    warehouse?: boolean | Prisma.WarehouseDefaultArgs<ExtArgs>;
};
export type $WarehouseLocationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WarehouseLocation";
    objects: {
        warehouse: Prisma.$WarehousePayload<ExtArgs>;
        inventory: Prisma.$InventoryPayload<ExtArgs>[];
        outgoing: Prisma.$StockMovementPayload<ExtArgs>[];
        incoming: Prisma.$StockMovementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        warehouseId: string;
        code: string;
        type: $Enums.LocationType;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["warehouseLocation"]>;
    composites: {};
};
export type WarehouseLocationGetPayload<S extends boolean | null | undefined | WarehouseLocationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload, S>;
export type WarehouseLocationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WarehouseLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WarehouseLocationCountAggregateInputType | true;
};
export interface WarehouseLocationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WarehouseLocation'];
        meta: {
            name: 'WarehouseLocation';
        };
    };
    findUnique<T extends WarehouseLocationFindUniqueArgs>(args: Prisma.SelectSubset<T, WarehouseLocationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WarehouseLocationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WarehouseLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WarehouseLocationFindFirstArgs>(args?: Prisma.SelectSubset<T, WarehouseLocationFindFirstArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WarehouseLocationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WarehouseLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WarehouseLocationFindManyArgs>(args?: Prisma.SelectSubset<T, WarehouseLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WarehouseLocationCreateArgs>(args: Prisma.SelectSubset<T, WarehouseLocationCreateArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WarehouseLocationCreateManyArgs>(args?: Prisma.SelectSubset<T, WarehouseLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WarehouseLocationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WarehouseLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WarehouseLocationDeleteArgs>(args: Prisma.SelectSubset<T, WarehouseLocationDeleteArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WarehouseLocationUpdateArgs>(args: Prisma.SelectSubset<T, WarehouseLocationUpdateArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WarehouseLocationDeleteManyArgs>(args?: Prisma.SelectSubset<T, WarehouseLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WarehouseLocationUpdateManyArgs>(args: Prisma.SelectSubset<T, WarehouseLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WarehouseLocationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WarehouseLocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WarehouseLocationUpsertArgs>(args: Prisma.SelectSubset<T, WarehouseLocationUpsertArgs<ExtArgs>>): Prisma.Prisma__WarehouseLocationClient<runtime.Types.Result.GetResult<Prisma.$WarehouseLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WarehouseLocationCountArgs>(args?: Prisma.Subset<T, WarehouseLocationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WarehouseLocationCountAggregateOutputType> : number>;
    aggregate<T extends WarehouseLocationAggregateArgs>(args: Prisma.Subset<T, WarehouseLocationAggregateArgs>): Prisma.PrismaPromise<GetWarehouseLocationAggregateType<T>>;
    groupBy<T extends WarehouseLocationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WarehouseLocationGroupByArgs['orderBy'];
    } : {
        orderBy?: WarehouseLocationGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WarehouseLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWarehouseLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WarehouseLocationFieldRefs;
}
export interface Prisma__WarehouseLocationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    warehouse<T extends Prisma.WarehouseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WarehouseDefaultArgs<ExtArgs>>): Prisma.Prisma__WarehouseClient<runtime.Types.Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    inventory<T extends Prisma.WarehouseLocation$inventoryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WarehouseLocation$inventoryArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    outgoing<T extends Prisma.WarehouseLocation$outgoingArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WarehouseLocation$outgoingArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    incoming<T extends Prisma.WarehouseLocation$incomingArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WarehouseLocation$incomingArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WarehouseLocationFieldRefs {
    readonly id: Prisma.FieldRef<"WarehouseLocation", 'String'>;
    readonly warehouseId: Prisma.FieldRef<"WarehouseLocation", 'String'>;
    readonly code: Prisma.FieldRef<"WarehouseLocation", 'String'>;
    readonly type: Prisma.FieldRef<"WarehouseLocation", 'LocationType'>;
    readonly createdAt: Prisma.FieldRef<"WarehouseLocation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"WarehouseLocation", 'DateTime'>;
}
export type WarehouseLocationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    where: Prisma.WarehouseLocationWhereUniqueInput;
};
export type WarehouseLocationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    where: Prisma.WarehouseLocationWhereUniqueInput;
};
export type WarehouseLocationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    where?: Prisma.WarehouseLocationWhereInput;
    orderBy?: Prisma.WarehouseLocationOrderByWithRelationInput | Prisma.WarehouseLocationOrderByWithRelationInput[];
    cursor?: Prisma.WarehouseLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WarehouseLocationScalarFieldEnum | Prisma.WarehouseLocationScalarFieldEnum[];
};
export type WarehouseLocationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    where?: Prisma.WarehouseLocationWhereInput;
    orderBy?: Prisma.WarehouseLocationOrderByWithRelationInput | Prisma.WarehouseLocationOrderByWithRelationInput[];
    cursor?: Prisma.WarehouseLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WarehouseLocationScalarFieldEnum | Prisma.WarehouseLocationScalarFieldEnum[];
};
export type WarehouseLocationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    where?: Prisma.WarehouseLocationWhereInput;
    orderBy?: Prisma.WarehouseLocationOrderByWithRelationInput | Prisma.WarehouseLocationOrderByWithRelationInput[];
    cursor?: Prisma.WarehouseLocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WarehouseLocationScalarFieldEnum | Prisma.WarehouseLocationScalarFieldEnum[];
};
export type WarehouseLocationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WarehouseLocationCreateInput, Prisma.WarehouseLocationUncheckedCreateInput>;
};
export type WarehouseLocationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WarehouseLocationCreateManyInput | Prisma.WarehouseLocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WarehouseLocationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    data: Prisma.WarehouseLocationCreateManyInput | Prisma.WarehouseLocationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WarehouseLocationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WarehouseLocationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateInput, Prisma.WarehouseLocationUncheckedUpdateInput>;
    where: Prisma.WarehouseLocationWhereUniqueInput;
};
export type WarehouseLocationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateManyMutationInput, Prisma.WarehouseLocationUncheckedUpdateManyInput>;
    where?: Prisma.WarehouseLocationWhereInput;
    limit?: number;
};
export type WarehouseLocationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WarehouseLocationUpdateManyMutationInput, Prisma.WarehouseLocationUncheckedUpdateManyInput>;
    where?: Prisma.WarehouseLocationWhereInput;
    limit?: number;
    include?: Prisma.WarehouseLocationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WarehouseLocationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    where: Prisma.WarehouseLocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.WarehouseLocationCreateInput, Prisma.WarehouseLocationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WarehouseLocationUpdateInput, Prisma.WarehouseLocationUncheckedUpdateInput>;
};
export type WarehouseLocationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
    where: Prisma.WarehouseLocationWhereUniqueInput;
};
export type WarehouseLocationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WarehouseLocationWhereInput;
    limit?: number;
};
export type WarehouseLocation$inventoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventorySelect<ExtArgs> | null;
    omit?: Prisma.InventoryOmit<ExtArgs> | null;
    include?: Prisma.InventoryInclude<ExtArgs> | null;
    where?: Prisma.InventoryWhereInput;
    orderBy?: Prisma.InventoryOrderByWithRelationInput | Prisma.InventoryOrderByWithRelationInput[];
    cursor?: Prisma.InventoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InventoryScalarFieldEnum | Prisma.InventoryScalarFieldEnum[];
};
export type WarehouseLocation$outgoingArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type WarehouseLocation$incomingArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type WarehouseLocationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WarehouseLocationSelect<ExtArgs> | null;
    omit?: Prisma.WarehouseLocationOmit<ExtArgs> | null;
    include?: Prisma.WarehouseLocationInclude<ExtArgs> | null;
};
