export const logIn = (data) => {
    return {
        type: 'LOG_IN',
        payload: data
    }
}
export const followMe = (id) => {

    return {
        type: 'FOLLOW',
        payload: id

    }

}