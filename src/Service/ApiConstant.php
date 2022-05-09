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
    // Les données de paramètre du système
    public const URL_LIST_SYSTEM_PARAMS = "parametre/params";
    public const URL_POST_SYSTEM_PARAMS = "parametre/params";
    public const URL_PUT_SYSTEM_PARAMS = "parametre/params/__id__";
    public const URL_PUT_SYSTEM_PARAMS_LOGO = "parametre/params/__id__/logo";
    // public const URL_GET_SYSTEM_PARAMS = "parametre/params/__id__";
    public const URL_GET_SYSTEM_PARAMS = "parametre/params/one";
    public const URL_DELETE_SYSTEM_PARAMS = "parametre/params/__id__";
    public const URL_GET_EMCEF_INFOS = "parametre/emcef/api/info/status";

    // Les taxes
    public const URL_LIST_TAXE = "parametre/taxe";
    public const URL_LIST_TAXE_AIB = "parametre/taxe-aib";
    public const URL_GET_TAXE = "parametre/taxe/__id__";

    // Les Types de facture
    public const URL_LIST_TYPE_FACTURE = "parametre/type-facture/vente";
    public const URL_LIST_TYPE_FACTURE_AVOIR = "parametre/type-facture/avoir";
    public const URL_GET_TYPE_FACTURE = "parametre/type-facture/__id__";

    // Les types de paiement
    public const URL_LIST_TYPE_PAIEMENT = "parametre/type-paiement";
    public const URL_GET_TYPE_PAIEMENT = "parametre/type-paiement/__id__";

    //Les utilisateurs
    public const URL_LIST_USER = "parametre/users";
    public const URL_POST_USER = "parametre/users";
    public const URL_PUT_USER = "parametre/users/__id__";
    public const URL_PUT_USER_PHOTO = "parametre/users/__id__/photo";
    public const URL_GET_USER = "parametre/users/__id__";
    public const URL_DELETE_USER = "parametre/users/__id__";
    public const URL_PUT_USER_PASSWORD_RESET = "parametre/users/__id__/reset-password";

    /*** Module Gestion de stock ***/
    // Catégorie des articles
    public const URL_LIST_CATEGORIE_ARTICLE = "stock/categorie-article";
    public const URL_POST_CATEGORIE_ARTICLE = "stock/categorie-article";
    public const URL_PUT_CATEGORIE_ARTICLE = "stock/categorie-article/__id__";
    public const URL_GET_CATEGORIE_ARTICLE = "stock/categorie-article/__id__";
    public const URL_DELETE_CATEGORIE_ARTICLE = "stock/categorie-article/__id__";
    // Les articles
    public const URL_LIST_ARTICLE = "stock/article";
    public const URL_POST_ARTICLE = "stock/article/categorie-article/__cId__/taxe/__tId__";
    public const URL_PUT_ARTICLE = "stock/article/__id__/categorie-article/__cId__/taxe/__tId__";
    public const URL_GET_ARTICLE = "stock/article/__id__";
    public const URL_DELETE_ARTICLE = "stock/article/__id__";

    //Les clients
    public const URL_LIST_CLIENT = "stock/client";
    public const URL_POST_CLIENT = "stock/client";
    public const URL_PUT_CLIENT = "stock/client/__id__";
    public const URL_GET_CLIENT = "stock/client/__id__";
    public const URL_DELETE_CLIENT = "stock/client/__id__";

    /*** Module Caisse ***/
    // Facturation et liste des factures
    public const URL_LIST_FACTURE = "factures";
    public const URL_POST_FACTURE = "factures/client/__clientId__/article/__articleId__";
    public const URL_VALIDER_FACTURE = "factures/__id__/valider";
    public const URL_IMPRIMER_FACTURE = "public/facture/__id__/imprimer";
    public const URL_PUT_FACTURE = "factures/__id__/detail/__detailId__";
    public const URL_GET_FACTURE = "factures/__id__";
    public const URL_DELETE_FACTURE = "factures/__id__";
    public const URL_DELETE_DETAIL_FACTURE = "factures/__id__/detail/__detailId__";
    public const URL_GET_FACTURE_CLIENT = "factures/client/__clientId__";
    public const URL_GET_DETAIL_FACTURE = "factures/__id__/detail/__detailId__";
    public const URL_VALIDER_DETAIL_FACTURE = "factures/__id__/detail/__detailId__/valider";
    public const URL_GET_FACTURE_BY_REF = "factures/reference/__ref__";
    
    // Les factures d'avoir
    public const URL_POST_FACTURE_AVOIR = "facture-avoir/type/__typeId__/facture-vente/__fvId__";
    public const URL_VALIDER_FACTURE_AVOIR = "facture-avoir/__id__/valider";
    public const URL_LIST_FACTURE_AUTOCOMPLETE = "factures/autocomplete/type/__typeId__";

    // Local url
    public const URL_DETAIL_FACTURE_AVOIR = "/factures/__id__/details";
    // Les fichiers
    public const URL_GET_FILE = "public/downloadFile/__fileName__";
}