<?php

namespace App\Service;

class ApiConstant
{
    // Url de Récupération des utilisateurs depuis l'API
    public const GET_USERS_URL = "parametre/users";
    public const GET_PROFILES_LIST_URL = "parametre/user-profiles/";
    // public const GET_AUTH_USER_URL = "auth/user";
    public const GET_AUTH_USER_URL = "parametre/users-connected";
    public const GET_AUTH_ACTIVATE_USER_URL = "auth/user/activate-password";
    public const GET_SYSTEM_INFO_URL = "parametre/system";

    public const GET_LOGO_UPDATE_URL = "parametre/system/logo";
    public const GET_LOGO_FILE_URL = "public/system/logo";
    public const GET_PUBLIC_SYSTEM_INFO_URL = "public/system/info";

    /***** Gestion des données de base : Paramètre *****/
    // Les taxes
    public const URL_LIST_TAXE = "parametre/taxe";
    public const URL_GET_TAXE = "parametre/taxe/__id__";
    // Les Types de facture
    public const URL_LIST_TYPE_FACTURE = "parametre/type-facture";
    public const URL_GET_TYPE_FACTURE = "parametre/type-facture/__id__";
    // Les types de paiement
    public const URL_LIST_TYPE_PAIEMENT = "parametre/type-paiement";
    public const URL_GET_TYPE_PAIEMENT = "parametre/type-paiement/__id__";

    /*** Module Gestion de stock ***/
    // Catégorie des articles
    public const URL_LIST_CATEGORIE_ARTICLE = "stock/categorie-article";
    public const URL_POST_CATEGORIE_ARTICLE = "stock/categorie-article";
    public const URL_PUT_CATEGORIE_ARTICLE = "stock/categorie-article/__id__";
    public const URL_GET_CATEGORIE_ARTICLE = "stock/categorie-article/__id__";
    public const URL_DELETE_CATEGORIE_ARTICLE = "stock/categorie-article/__id__";
    // Catégorie des articles
    public const URL_LIST_ARTICLE = "stock/article";
    public const URL_POST_ARTICLE = "stock/article/categorie-article/__cId__/taxe/__tId__";
    public const URL_PUT_ARTICLE = "stock/article/__id__/categorie-article/__cId__/taxe/__tId__";
    public const URL_GET_ARTICLE = "stock/article/__id__";
    public const URL_DELETE_ARTICLE = "stock/article/__id__";
 
     /*** Module Gestion Client ***/
     //CRUD client
     public const URL_LIST_CLIENT = "client";
     public const URL_POST_CLIENT = "client";
     public const URL_PUT_CLIENT = "client/__id__";
     public const URL_GET_CLIENT = "client/__id__";
     public const URL_DELETE_CLIENT = "client/__id__";

     /*** Module Caisse ***/
     // Facturation et liste des factures
     public const URL_LIST_FACTURE = "factures";
     public const URL_POST_FACTURE = "factures/client/__clientId__";
     public const URL_PUT_FACTURE = "factures/__id__/detail/__detailId__";
     public const URL_GET_FACTURE = "factures/__id__";
     public const URL_VALIDER_FACTURE = "factures/__id__/valider";
     public const URL_DELETE_FACTURE = "factures/__id__/detail/__detailId__";
     public const URL_GET_FACTURE_CLIENT = "factures/client/__clientId__";
     public const URL_GET_DETAIL_FACTURE= "factures/__id__/detail/__detailId__";
     public const URL_VALIDER_DETAIL_FACTURE= "factures/__id__/detail/__detailId__/valider";

}