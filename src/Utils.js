export function GetMYAccountClient(){
    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_MY_CLIENT_ID,
        scope: import.meta.env.VITE_MY_SCOPES,
        redirect_uri: import.meta.env.VITE_MY_REDIRECT
    });

    return params.toString();
}