export function GetMYAccountClient(){
    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_MY_CLIENT_ID,
        scope: import.meta.env.VITE_MY_SCOPES,
        redirect_uri: import.meta.env.VITE_MY_CODE_URL
    });

    return params.toString();
}

export const updateAlert = (setAlert, key, value) => {
    setAlert(prev => ({
        ...prev,
        [key]: value
    }));
};