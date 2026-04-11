export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN_MMS = "ADMIN_MMS",
    ADMIN_CLIENT = "ADMIN_CLIENT",
    EMPLOYEE = "EMPLOYEE",
    COOK = "COOK",
    PATIENT = "PATIENT"
}
export declare enum MenuMode {
    AUTONOME = "AUTONOME",
    MMS = "MMS"
}
export declare enum SubventionType {
    FIXED = "FIXED",
    PERCENTAGE = "PERCENTAGE",
    CAPPED = "CAPPED",
    HYBRID = "HYBRID",
    FULL = "FULL"
}
export declare enum MealSlot {
    MORNING = "MORNING",
    NOON = "NOON",
    EVENING = "EVENING"
}
export declare enum DishCategory {
    ENTREE = "ENTREE",
    RESISTANCE = "RESISTANCE",
    DESSERT = "DESSERT",
    CAFE = "CAFE",
    BOISSON = "BOISSON"
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PAID = "PAID",
    PREPARING = "PREPARING",
    READY = "READY",
    RETRIEVED = "RETRIEVED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentMethod {
    WAVE = "WAVE",
    ORANGE_MONEY = "ORANGE_MONEY",
    MTN = "MTN",
    CINETPAY = "CINETPAY",
    PAYDUNYA = "PAYDUNYA",
    WALLET = "WALLET",
    EMPLOYER = "EMPLOYER"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum NotificationChannel {
    PUSH = "PUSH",
    EMAIL = "EMAIL",
    SMS = "SMS"
}
