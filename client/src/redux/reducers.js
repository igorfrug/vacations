
let initialStateOfUser = {}
export const loginReducer = (state = initialStateOfUser, action) => {
    switch (action.type) {
        case 'LOG_IN':
            const { id, name, sur_name, role, username, password, signedIn, access_token, refresh_token } = action.payload

            return {...state,
                id,
                name,
                sur_name,
                role,
                username,
                password,
                signedIn,
                access_token,
                refresh_token
            }
        case 'LOG_OUT':
            return initialStateOfUser
        default:
            return state
    }



}