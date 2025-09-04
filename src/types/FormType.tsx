export interface FormPropsType{
    errors:any;
    control?:any;
    register:any;
    handleSubmit:any;
    onSubmit:any;
    isLoading:boolean;
}

//type pour le form d'enregistrement
export interface RegisterFormType{
    email:string,
    password:string,
    role:"entreprise"|"independant";

}
// type pour le form login
export interface LoginFormType{
    email:string,
    password:string,
    role:"entreprise"|"independant";

}