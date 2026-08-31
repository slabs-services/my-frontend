export function GetMYAccountClient(){
    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_MY_CLIENT_ID,
        scope: import.meta.env.VITE_MY_SCOPES,
        redirect_uri: import.meta.env.VITE_MY_CODE_URL
    });

    return params.toString();
}

export const updateValidation = (setValidations, key, value) => {
    setValidations(prev =>
        prev.map(item =>
            item.field === key
                ? { ...item, message: value }
                : item
        )
    );
};

export const updateAlert = (setAlert, key, value) => {
    setAlert(prev => ({
        ...prev,
        [key]: value
    }));
};

export function getFirstLastName(name){
    const nameSplit = name.split(" ");
    if(nameSplit.length === 1){
        return nameSplit[0];
    }else{
        return nameSplit[0] + " " + nameSplit[nameSplit.length-1];
    }
}