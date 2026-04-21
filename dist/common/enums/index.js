"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allergy = exports.DietaryRegime = exports.FinancialMode = exports.NotificationChannel = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = exports.DishCategory = exports.MealSlot = exports.SubventionType = exports.MenuMode = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN_MMS"] = "ADMIN_MMS";
    UserRole["ADMIN_CLIENT"] = "ADMIN_CLIENT";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
    UserRole["COOK"] = "COOK";
    UserRole["PATIENT"] = "PATIENT";
})(UserRole || (exports.UserRole = UserRole = {}));
var MenuMode;
(function (MenuMode) {
    MenuMode["AUTONOME"] = "AUTONOME";
    MenuMode["MMS"] = "MMS";
})(MenuMode || (exports.MenuMode = MenuMode = {}));
var SubventionType;
(function (SubventionType) {
    SubventionType["FIXED"] = "FIXED";
    SubventionType["PERCENTAGE"] = "PERCENTAGE";
    SubventionType["CAPPED"] = "CAPPED";
    SubventionType["HYBRID"] = "HYBRID";
    SubventionType["FULL"] = "FULL";
})(SubventionType || (exports.SubventionType = SubventionType = {}));
var MealSlot;
(function (MealSlot) {
    MealSlot["MORNING"] = "MORNING";
    MealSlot["NOON"] = "NOON";
    MealSlot["EVENING"] = "EVENING";
})(MealSlot || (exports.MealSlot = MealSlot = {}));
var DishCategory;
(function (DishCategory) {
    DishCategory["ENTREE"] = "ENTREE";
    DishCategory["RESISTANCE"] = "RESISTANCE";
    DishCategory["DESSERT"] = "DESSERT";
    DishCategory["CAFE"] = "CAFE";
    DishCategory["BOISSON"] = "BOISSON";
    DishCategory["COLLATION"] = "COLLATION";
})(DishCategory || (exports.DishCategory = DishCategory = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["READY"] = "READY";
    OrderStatus["RETRIEVED"] = "RETRIEVED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["WAVE"] = "WAVE";
    PaymentMethod["ORANGE_MONEY"] = "ORANGE_MONEY";
    PaymentMethod["MTN"] = "MTN";
    PaymentMethod["CINETPAY"] = "CINETPAY";
    PaymentMethod["PAYDUNYA"] = "PAYDUNYA";
    PaymentMethod["WALLET"] = "WALLET";
    PaymentMethod["EMPLOYER"] = "EMPLOYER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUCCESS"] = "SUCCESS";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var FinancialMode;
(function (FinancialMode) {
    FinancialMode["DEBT"] = "DEBT";
    FinancialMode["WALLET"] = "WALLET";
})(FinancialMode || (exports.FinancialMode = FinancialMode = {}));
var DietaryRegime;
(function (DietaryRegime) {
    DietaryRegime["SANS_SEL"] = "SANS_SEL";
    DietaryRegime["SANS_GRAS"] = "SANS_GRAS";
    DietaryRegime["SANS_SUCRE"] = "SANS_SUCRE";
    DietaryRegime["SANS_HUILE"] = "SANS_HUILE";
    DietaryRegime["VEGETARIEN"] = "VEGETARIEN";
    DietaryRegime["HALAL"] = "HALAL";
})(DietaryRegime || (exports.DietaryRegime = DietaryRegime = {}));
var Allergy;
(function (Allergy) {
    Allergy["ARACHIDES"] = "ARACHIDES";
    Allergy["CRUSTACES"] = "CRUSTACES";
    Allergy["OEUFS"] = "OEUFS";
    Allergy["POISSONS"] = "POISSONS";
    Allergy["SOJA"] = "SOJA";
    Allergy["LAIT"] = "LAIT";
    Allergy["FRUITS_A_COQUE"] = "FRUITS_A_COQUE";
    Allergy["CELERI"] = "CELERI";
    Allergy["MOUTARDE"] = "MOUTARDE";
    Allergy["SESAME"] = "SESAME";
    Allergy["SULFITES"] = "SULFITES";
    Allergy["LUPIN"] = "LUPIN";
    Allergy["MOLLUSQUES"] = "MOLLUSQUES";
    Allergy["GLUTEN"] = "GLUTEN";
    Allergy["AUCUNE"] = "AUCUNE";
})(Allergy || (exports.Allergy = Allergy = {}));
//# sourceMappingURL=index.js.map