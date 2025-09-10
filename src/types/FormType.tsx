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
    role:"entreprise"|"independant"|"client";

}
// type pour le form login
export interface LoginFormType{
    email:string,
    password:string,

}

//type pour password perdu
export interface ForgetPasswordFormType{
    email:string,
}
export interface confirmFormType{
    code:string,
}

//type travailleur
export interface TravailleurFormType{
    prenom:string,
    nom:string,
    telephone:string,
    adresse:string,
    secteur:string,
    zoneIntervention:string,
    profil:string,
    bio:string
}

//secteur d'activité
export interface SecteurFormType{
    nom:string,
    _id:string,//pour passer l'id au utilisateur comme clé etrangere
    picture:string
}

//client
export interface ClientFormType{
    prenom:string,
    nom:string,
    telephone:string,
    _id:string //on recuperer l'id venant de user connecté pour le stocker dans client
}

export interface EntrepriseFormType{
    nom:string,
    telephone:string,
    secteur:string,
    bio:string,
    adresse:string,
    _id:string //on recuperer l'id venant de user connecté pour le stocker dans entreprise

}
export interface ProjetTypeForm{
    description:string,
    dateDebut:string,
    localite:string,
    secteur:string,
   user:string

}