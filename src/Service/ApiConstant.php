<?php

namespace App\Service;

class ApiConstant
{

    // Types de structure
    public const TS_CPS = 1;
    public const TS_TRIBUNAL = 2;
    public const TS_PARQUET = 3;
    public const TS_CTDEC = 4;
    public const TS_CEC = 5;

    // Types des actes
    public const ACTE_NAISSANCE = 1;
    public const ACTE_DECES = 2;

    // Statut Demande
    public const SD_SAISIE_NON_TERMINEE = 101;
    public const SD_SAISIE_TERMINEE = 111;
    public const SD_NINA_NON_ATTRIBUE = 211;
    public const SD_NINA_ATTRIBUE = 212;
    public const SD_EN_DOUBLON = 201;
    public const SD_VISA_PARQUET = 311;
    public const SD_NON_VISA_PARQUET = 301;
    public const SD_CONFORME = 411;
    public const SD_NON_CONFORME = 401;
    public const SD_JUGEMENT_SUPPLETIF_FAIT = 511;

    // Liste des features
    public const PROCESS_ENREGISTREMENT = 100;
    public const PROCESS_VERIFICATION_RAVEC = 200;
    public const PROCESS_VISA_PARQUET = 300;
    public const PROCESS_VERIFICATION_CONFORMITE = 400;
    public const PROCESS_DELIVRANCE = 500;
    public const PROCESS_CONSULTATION = 600;
    public const SETTINGS_AUDIT = 9000;
    public const SETTINGS_SYSTEM = 9001;
    public const SETTINGS_GROUP = 9011;
    public const SETTINGS_USER = 9012;
    public const SETTINGS_LIST = 9100;
    public const RAPPORT_STATISTIQUES = 9200;

    // URLs
    public const URL_DOSSIERS_ENCOURS = "delivrance-js/demandes/en-cours";
    public const URL_DOSSIERS_VALIDES = "delivrance-js/demandes/valides";
    public const URL_FORMULAIRE_DEMANDE_AN = "public/structures/__structureId__/formulaire-an";
    public const URL_FORMULAIRE_DEMANDE_AD = "public/structures/__structureId__/formulaire-ad";

    //Pour la liste des dossiers
    public const ENREGISTREMEN_AN_LISTE_URL = "delivrance-js/demandes/type/1/enregistrement";
    public const ENREGISTREMEN_AD_LISTE_URL = "delivrance-js/demandes/type/2/enregistrement";
    public const RAVEC_AN_LISTE_URL = "delivrance-js/demandes/type-an/verification-ravec";
    public const VP_AN_LISTE_URL = "delivrance-js/demandes/type-an/visa-parquet";
    public const VP_AD_LISTE_URL = "delivrance-js/demandes/type-ad/visa-parquet";
    public const DTR_AN_LISTE_URL = "delivrance-js/demandes/type/1/decision-tribunal";
    public const DTR_AD_LISTE_URL = "delivrance-js/demandes/type/2/decision-tribunal";
    public const DLV_AN_LISTE_URL = "delivrance-js/demandes/type/1/statut/411";
    public const DLV_AD_LISTE_URL = "delivrance-js/demandes/type/2/statut/411";
    //Pour la récupération d'un dossier (début de l'url)
    public const GET_DOSSIERS_URL = "delivrance-js/demandes/";

    // Url de mise à jour d'un dossier quelque soit l'étape, les valeurs avec __ sont gérées dans le fichiers javascript
    public const UPDATE_AN_URL = "delivrance-js/demandes/__demandeId__/__etape__/decision/__statutId__";

    //l'url pour telecharger les pièces
    public const URL_TELECHARGER_PIECE = "delivrance-js/demandes/piece/__pieceId__/fichier";

    // Url de Récupération des utilisateurs depuis l'API
    public const GET_USERS_URL = "parametre/users";
    public const GET_PROFILES_LIST_URL = "parametre/user-profiles/";
    // public const GET_AUTH_USER_URL = "auth/user";
    public const GET_AUTH_USER_URL = "parametre/users-connected";
    public const GET_AUTH_ACTIVATE_USER_URL = "auth/user/activate-password";
    public const GET_SYSTEM_INFO_URL = "parametre/system";
    // Url de Récupération des données de saisie d'une demande
    public const GET_TYPE_DOCS_JS_URL = "parametre/type-docs/type-js/";
    public const URL_REGIONS = "parametre/regions";
    public const URL_CERCLES = "parametre/cercles";
    public const URL_CERCLES_REGION = "parametre/cercles/region/__id__";
    public const URL_ARRONDISSEMENTS = "parametre/arrondissements";
    public const URL_ARRONDISSEMENTS_CERCLE = "parametre/arrondissements/cercle/__id__";
    public const URL_COMMUNES = "parametre/communes";
    public const URL_COMMUNES_ARRONDISSEMENT = "parametre/communes/arrondissement/__id__";
    public const GET_SITUATION_MATRIMONIAL_LIST_URL = "parametre/situationmatrimoniales/";
    public const GET_SEXES_LIST_URL = "parametre/sexes/";
    public const GET_LIENS_LIST_URL = "parametre/liens/";

    //recupérer les documents associés à une demande
    public const GET_DOCS_LIST = "delivrance-js/demandes/__demandeId__/pieces";

    public const GET_TYPES_STRUCTURES_LIST_URL = "parametre/type-structures";
    public const GET_TYPES_STRUCTURES_COMMUNES_LIST_URL = "parametre/type-structures-communes";
    public const GET_STRUCTURES_LIST_URL = "parametre/structures";
    public const GET_STRUCTURES_OF_TYPE_LIST_URL = "parametre/structures/type-structure/";
    public const GET_STRUCTURES_BY_TYPE_LIST_URL = self::GET_STRUCTURES_OF_TYPE_LIST_URL . "__type_id__";
    public const GET_LIST_JUGES_FROM_STRUCTURE_URL = "parametre/structure/__structureId__/juges";
    public const GET_LIST_GREFFIERS_FROM_STRUCTURE_URL = "parametre/structure/__structureId__/greffiers-audienciers";
    public const GET_LIST_GREFFIERS_CHEF_FROM_STRUCTURE_URL = "parametre/structure/__structureId__/greffiers-chefs";
    public const GET_LIST_PROCUREURS_FROM_STRUCTURE_URL = "parametre/structure/__structureId__/procureurs";
    public const GET_LIST_SUBSTITUTS_FROM_STRUCTURE_URL = "parametre/structure/__structureId__/substitut-procureurs";
    public const GET_DOC_FICHIER_URL = "public/delivrance-js/demandes/piece/__docId__/fichier";
    public const GET_LOGO_UPDATE_URL = "parametre/system/logo";
    public const GET_LOGO_FILE_URL = "public/system/logo";
    public const GET_PUBLIC_SYSTEM_INFO_URL = "public/system/info";

    //Pour recupérer le duplicata
    public const GET_RECEPISSE_DUPLICATA = "public/delivrance-js/demandes/__demandeId__/recepisse-duplicata";


    // Gestion hôtelière
    /*** Module Parmètre ***/
    // Type de Chambre
    public const URL_LIST_TYPE_CHAMBRE = "parametre/type-chambre";
    public const URL_POST_TYPE_CHAMBRE = "parametre/type-chambre";
    public const URL_PUT_TYPE_CHAMBRE = "parametre/type-chambre/__id__";
    public const URL_GET_TYPE_CHAMBRE = "parametre/type-chambre/__id__";
    public const URL_DELETE_TYPE_CHAMBRE = "parametre/type-chambre/__id__";

     // Type de service interne
     public const URL_LIST_TYPE_SERVICE_INTERNE = "service-interne/type";
     public const URL_POST_TYPE_SERVICE_INTERNE = "service-interne/type";
     public const URL_PUT_TYPE_SERVICE_INTERNE = "service-interne/type/__id__";
     public const URL_GET_TYPE_SERVICE_INTERNE = "service-interne/type/__id__";
     public const URL_DELETE_TYPE_SERVICE_INTERNE = "service-interne/type/__id__";

    // Poste Personnel
    public const URL_LIST_POSTE_PERSONNEL = "parametre/poste-personnel";
    public const URL_POST_POSTE_PERSONNEL = "parametre/poste-personnel";
    public const URL_PUT_POSTE_PERSONNEL = "parametre/poste-personnel/__id__";
    public const URL_GET_POSTE_PERSONNEL = "parametre/poste-personnel/__id__";
    public const URL_DELETE_POSTE_PERSONNEL = "parametre/poste-personnel/__id__";

    /*** Module GRH ***/
    // Personnel
    public const URL_LIST_PERSONNEL = "grh/personnel";
    public const URL_POST_PERSONNEL = "grh/personnel/poste-personnel/__idPoste__";
    public const URL_PUT_PERSONNEL = "grh/personnel/__id__/poste-personnel/__idPoste__";
    public const URL_GET_PERSONNEL = "grh/personnel/__id__";
    public const URL_DELETE_PERSONNEL = "grh/personnel/__id__";
    
     // Garde
     public const URL_LIST_GARDE = "grh/garde";
     public const URL_POST_GARDE = "grh/garde";
     public const URL_PUT_GARDE = "grh/garde/__id__";
     public const URL_GET_GARDE = "grh/garde/__id__";
     public const URL_DELETE_GARDE = "grh/garde/__id__";
     // Paie
     public const URL_LIST_PAIE = "paie/mois/__moisId__";
     public const URL_POST_PAIE = "paie/mois/__moisId__/personnel/__personnelId__";
     public const URL_PUT_PAIE = "paie/__id__/mois/__moisId__/personnel/__personnelId__";
     public const URL_GET_PAIE = "paie/__id__";
     public const URL_DELETE_PAIE = "paie/__id__";
     public const URL_START_PAIE_MONTH = "paie/mois/start";
     public const URL_STARTED_PAIE_MONTH = "paie/started-month";
     public const URL_STOP_PAIE_MONTH = "paie/mois/__moisId__/stop";
     public const URL_UPDATE_LIST_PAIE_MONTH = "paie/update/mois/__moisId__";
     public const URL_GET_MONTH_BY_LIBELLE = "paie/mois/get/libelle/__libelle__";
 
     /*** Module Gestion des Chambres ***/
     // Crud chambre
     public const URL_LIST_CHAMBRE = "parametre/chambre";
     public const URL_POST_CHAMBRE = "parametre/chambre/type-chambre/__tId__";
     public const URL_PUT_CHAMBRE = "parametre/chambre/__id__/type-chambre/__tId__";
     public const URL_GET_CHAMBRE = "parametre/chambre/__id__";
     public const URL_DELETE_CHAMBRE = "parametre/chambre/__id__";
 
     // entretien
     public const URL_LIST_ENTRETIEN = "parametre/entretien";
     public const URL_POST_ENTRETIEN = "parametre/entretien/chambre/__chambreId__/personnel/__personnelId__";
     public const URL_PUT_ENTRETIEN = "parametre/entretien/__id__/chambre/__chambreId__/personnel/__personnelId__";
     public const URL_GET_ENTRETIEN = "parametre/entretien/__id__";
     public const URL_DELETE_ENTRETIEN = "parametre/entretien/__id__";
 
     //nettoyage
     public const URL_LIST_NETTOYAGE = "parametre/nettoyage";
     public const URL_POST_NETTOYAGE = "parametre/nettoyage/chambre/__chambreId__/personnel/__personnelId__";
     public const URL_PUT_NETTOYAGE = "parametre/nettoyage/__id__/chambre/__chambreId__/personnel/__personnelId__";
     public const URL_GET_NETTOYAGE = "parametre/nettoyage/__id__";
     public const URL_DELETE_NETTOYAGE = "parametre/nettoyage/__id__";
 
     /*** service interne ***/
     //service interne
     public const URL_LIST_SERVICE_INTERNE = "service-interne";
     public const URL_POST_SERVICE_INTERNE = "service-interne/ts/__typeId__";
     public const URL_PUT_SERVICE_INTERNE = "service-interne/__id__/ts/__typeId__";
     public const URL_GET_SERVICE_INTERNE = "service-interne/__id__";
     public const URL_DELETE_SERVICE_INTERNE = "service-interne/__id__";
 
     /*** Module Gestion Client ***/
     //CRUD client
     public const URL_LIST_CLIENT = "client";
     public const URL_POST_CLIENT = "client";
     public const URL_PUT_CLIENT = "client/__id__";
     public const URL_GET_CLIENT = "client/__id__";
     public const URL_DELETE_CLIENT = "client/__id__";
 
     // Réservation
     public const URL_LIST_RESERVATION = "reservation";
     public const URL_POST_RESERVATION = "reservation/client/__idClient__";
     public const URL_PUT_RESERVATION = "reservation/__id__/client/__idClient__";
     public const URL_GET_RESERVATION = "reservation/__id__";
     public const URL_DELETE_RESERVATION = "reservation/__id__";
     
     //Fiche Réservation
     public const URL_LIST_FICHE_RESERVATION = "fiche-reservation";
     public const URL_GET_FICHE_RESERVATION = "fiche-reservation/__ficheId__";
     public const URL_VALIDATION_FICHE_RESERVATION = "fiche-reservation/__ficheId__/valider";
     public const URL_CONFIRMATION_FICHE_RESERVATION = "fiche-reservation/__ficheId__/confirmer";


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