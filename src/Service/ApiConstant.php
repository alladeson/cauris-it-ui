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
    public const URL_LIST_TAXE_IMPOT = "parametre/taxe-impots";
    public const URL_LIST_TAXE_AIB = "parametre/taxe-aib";
    public const URL_GET_TAXE = "parametre/taxe/__id__";

    // Les Types de facture
    public const URL_LIST_TYPE_FACTURE = "parametre/type-facture";
    public const URL_LIST_TYPE_FACTURE_VENTE = "parametre/type-facture/vente";
    public const URL_LIST_TYPE_FACTURE_AVOIR = "parametre/type-facture/avoir";
    public const URL_GET_TYPE_FACTURE = "parametre/type-facture/__id__";

    // Les types de paiement
    public const URL_LIST_TYPE_PAIEMENT = "parametre/type-paiement";
    public const URL_GET_TYPE_PAIEMENT = "parametre/type-paiement/__id__";

    //Pour les paramètre de disposition des pages (Layout)
    public const URL_LIST_LAYOUT = "parametre/layout-settings";
    public const URL_POST_LAYOUT = "parametre/layout-settings";
    public const URL_PUT_LAYOUT = "parametre/layout-settings/__id__";
    public const URL_GET_LAYOUT = "parametre/layout-settings/__id__";
    public const URL_DELETE_LAYOUT = "parametre/layout-settings/__id__";

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
    public const URL_LIST_FACTURE_BY_TYPE = "factures/type/__typeId__";
    public const URL_LIST_FACTURE_BY_TYPE_CREATED_DATE = "factures/type/__typeId__/created-at";
    public const URL_LIST_FACTURE_BY_TYPE_CONFIRMED_DATE = "factures/type/__typeId__/confirmed-at";
    public const URL_LIST_FACTURE_BY_CREATED_DATE = "factures/list/created-at";
    public const URL_LIST_FACTURE_BY_CONFIRMED_DATE = "factures/list/confirmed-at";
    public const URL_POST_FACTURE = "factures/client/__clientId__/article/__articleId__";
    public const URL_VALIDER_FACTURE = "factures/__id__/valider";
    public const URL_IMPRIMER_FACTURE = "public/facture/__id__/imprimer";
    public const URL_PUT_FACTURE = "factures/__id__/detail/__detailId__";
    public const URL_GET_FACTURE = "factures/__id__";
    public const URL_DELETE_FACTURE = "factures/__id__";
    public const URL_DELETE_DETAIL_FACTURE = "factures/__id__/detail/__detailId__";
    public const URL_GET_FACTURE_CLIENT = "factures/client/__clientId__/type/__typeId__";
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

    /*** Contrôle d'accès et Audit ***/
    //Les utilisateurs
    public const URL_LIST_USER = "parametre/users/admin";
    public const URL_LIST_USER_SA = "parametre/users/super-admin";
    public const URL_POST_USER = "parametre/users/groupe/__groupeId__";
    public const URL_PUT_USER = "parametre/users/__id__/groupe/__groupeId__";
    public const URL_PUT_USER_PHOTO = "parametre/users/__id__/photo";
    public const URL_GET_USER = "parametre/users/__id__";
    public const URL_DELETE_USER = "parametre/users/__id__";
    public const URL_PUT_USER_PASSWORD_RESET = "parametre/users/__id__/reset-password"; 

    // Groupe Utilisateur
    public const URL_LIST_USER_GROUP_SA = "access/user-groups/super-admin";
    public const URL_LIST_USER_GROUP = "access/user-groups/admin";
    public const URL_POST_USER_GROUP = "access/user-groups";
    public const URL_GET_USER_GROUP = "access/user-groups/__groupeId__";
    public const URL_PUT_USER_GROUP = "access/user-groups/__groupeId__";
    public const URL_DELETE_USER_GROUP = "access/user-groups/__groupeId__";

    // Les features
    
    public const URL_LIST_FEATURES_SA = "access/features/super-admin";
    public const URL_LIST_FEATURES = "access/features/admin";
    // public const URL_POST_FEATURES = "access/features";
    public const URL_GET_FEATURES = "access/features/__featureId__";
    public const URL_GET_FEATURES_BY_CODE = "access/features/code/__featureCode__";
    // public const URL_PUT_FEATURES = "access/features/__featureId__";
    // public const URL_DELETE_USER_GROUP = "access/features/__featureId__";

    // Les accès (Access)
    public const URL_LIST_ACCESS_SA = "access/accesses/super-admin";
    public const URL_LIST_ACCESS = "access/accesses/admin";
    public const URL_LIST_ACCESS_BY_USER_GROUP = "access/accesses/user-group/__groupeId__";
    public const URL_LIST_ACCESS_BY_CONNECTED_USER = "access/accesses/connected-user";
    public const URL_POST_ACCESS = "access/accesses/user-group/__groupeId__/feature/__featureId__";
    public const URL_GET_ACCESS = "access/accesses/__id__";

    // Les audits
    public const URL_LIST_AUDIT = "access/audit";
    public const URL_LIST_AUDIT_BY_CONNECTED_USER = "access/audit/connected-user";
    public const URL_GET_AUDIT = "access/audit/__auditId__";

    /** Gestion des statistiques **/
    // Bilan des factures
    public const URL_LIST_FACTURE_VENTE_BY_CONFIRMED_DATE = "stats/bilan-periodique/facture-vente";
    public const URL_LIST_FACTURE_AVOIR_BY_CONFIRMED_DATE = "stats/bilan-periodique/facture-avoir";
    public const URL_LIST_FACTURE_RECAP_BY_CONFIRMED_DATE = "stats/bilan-periodique/facture-recap";
    public const URL_IMPRESSION_BILAN_PERIODIQUE_BY_CONFIRMED_DATE = "stats/bilan-periodique/report";
    public const URL_BILAN_DASHBOARD = "stats/bilan-periodique/dashboard";

    // Les codes des fonctionnalités
    // Gestion de stock
	public const gestStock = 10000;
	public const gestStockCategorie = 11000;
	public const gestStockArticle = 12000;
	// Emission des factures
	public const facturation = 20000;
	public const facturationFV = 21000;
	public const facturationFA = 22000;
	public const facturationListe = 23000;
	public const facturationClient = 24000;
	// Les données de base et paramètre du système
	public const parametre = 30000;
	public const parametreTaxe = 31000;
	public const parametreTypeFacture = 32000;
	public const parametreTypePaiement = 33000;
	public const parametreSysteme = 34000;
	public const parametreDonneSysteme= 35000;
	// Le contrôle d'accès
	public const accessCtrl = 40000;
	public const accessCtrlUser = 41000;
	public const accessCtrlUserGroup = 42000;
	public const accessCtrlFeatures = 43000;
	public const accessCtrlAccess = 44000;
	// Les audits
	public const audit = 50000;
    // Les statistiques
	public const stats = 60000;
	public const statsBilanPeriodique = 61000;
}