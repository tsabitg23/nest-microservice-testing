export const USER_ROLE = {
    ADMIN: 'admin',
    SALES: 'sales',
};

export const AUTHORIZATION = {
    product: [USER_ROLE.ADMIN],
    order: [USER_ROLE.ADMIN, USER_ROLE.SALES],
}
