export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly MANAGER: "MANAGER";
    readonly SUPERVISOR: "SUPERVISOR";
    readonly OPERATOR: "OPERATOR";
    readonly VIEWER: "VIEWER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const LocationType: {
    readonly RECEIVING: "RECEIVING";
    readonly STORAGE: "STORAGE";
    readonly PICKING: "PICKING";
    readonly PACKING: "PACKING";
    readonly SHIPPING: "SHIPPING";
    readonly RETURNS: "RETURNS";
};
export type LocationType = (typeof LocationType)[keyof typeof LocationType];
export declare const StockMovementType: {
    readonly INBOUND: "INBOUND";
    readonly OUTBOUND: "OUTBOUND";
    readonly TRANSFER: "TRANSFER";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly RETURN: "RETURN";
};
export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType];
