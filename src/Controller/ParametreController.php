<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ApiConstant;
use App\Service\ApiDataService;
use Symfony\Component\HttpClient\Exception\TransportException;

#[Route('/parametre')]
class ParametreController extends AbstractController
{
    private $apiService;
    public function __construct(ApiDataService $apiService)
    {
        $this->apiService = $apiService;
    }
    
    /**
     * Afficher la liste des taxes
     *
     * @return Response
     */
    #[Route('/taxe', name: 'parametre_taxe')]
    public function taxeList(): Response
    {
        return $this->render('parametre/taxe.html.twig', [
            'page_title' => 'Taxe',
            'breadcrumb' => ['Paramètres', 'Taxe'],
            "sidebar_code" => ['PARAMS', 'TAXE', ''],
            "url_list_item" => ApiConstant::URL_LIST_TAXE,
            "url_get_item" => ApiConstant::URL_GET_TAXE,
        ]);
    }

    /**
     * Afficher la liste des type de facture
     *
     * @return Response
     */
    #[Route('/type-facture', name: 'parametre_type_facture')]
    public function typeFactureList(): Response
    {
        return $this->render('parametre/type-facture.html.twig', [
            'page_title' => 'Type de facture',
            'breadcrumb' => ['Paramètres', 'Type de facture'],
            "sidebar_code" => ['PARAMS', 'TPF', ''],
            "url_list_item" => ApiConstant::URL_LIST_TYPE_FACTURE,
            "url_get_item" => ApiConstant::URL_GET_TYPE_FACTURE,
        ]);
    }

    /**
     * Afficher la liste des type de paiement
     *
     * @return Response
     */
    #[Route('/type-paiement', name: 'parametre_type_paiement')]
    public function typePaiementList(): Response
    {
        return $this->render('parametre/type-paiement.html.twig', [
            'page_title' => 'Type de paiement',
            'breadcrumb' => ['Paramètres', 'Type de paiement'],
            "sidebar_code" => ['PARAMS', 'TPP', ''],
            "url_list_item" => ApiConstant::URL_LIST_TYPE_PAIEMENT,
            "url_get_item" => ApiConstant::URL_GET_TYPE_PAIEMENT,
        ]);
    }

    /**
     * Afficher l'interface de gestion des utilisateurs
     *
     * @return Response
     */
    #[Route('/utilisateurs', name: 'parametre_users')]
    public function users(): Response
    {
        return $this->render('parametre/user.html.twig', [
            'page_title' => 'Utilisateurs',
            'breadcrumb' => ['Paramètres', 'Utilisateurs'],
            "sidebar_code" => ['PARAMS', 'USR', ''],
            "url_list_item" => ApiConstant::URL_LIST_USER,
            "url_post_item" => ApiConstant::URL_POST_USER,
            "url_put_item" => ApiConstant::URL_PUT_USER,
            "url_get_item" => ApiConstant::URL_GET_USER,
            "url_delete_item" => ApiConstant::URL_DELETE_USER,
            "url_put_item_password_reset" => ApiConstant::URL_PUT_USER_PASSWORD_RESET,
        ]);
    }

    /**
     * Afficher l'interface de gestion du profil utilisateur
     *
     * @return Response
     */
    #[Route('/utilisateurs/profil', name: 'parametre_users_profile')]
    public function usersProfile(): Response
    {
        $user = null;
        try {
            // Tentative de récupération de l'utilisateur connecté
            $user = $this->apiService->getAuthUser();
        } catch (TransportException $th) {
            throw $th;
            //dd($th);
        }
        return $this->render('parametre/user-profile.html.twig', [
            'page_title' => 'Profil utilisateur',
            'breadcrumb' => ['Paramètres', 'Profil utilisateur'],
            "sidebar_code" => ['PARAMS', 'USP', ''],
            "url_put_item" => ApiConstant::URL_PUT_USER,
            "url_get_item" => ApiConstant::URL_GET_USER,
            "url_put_item_password_reset" => ApiConstant::URL_PUT_USER_PASSWORD_RESET,
            "url_put_item_photo" => ApiConstant::URL_PUT_USER_PHOTO,
            "user" => $user
        ]);
    }

    /**
     * Afficher l'interface de création du paramètre de système
     *
     * @return Response
     */
    #[Route('/system-params/new', name: 'parametre_new')]
    public function newSystemParam(): Response
    {
        return $this->render('parametre/new-system-params.html.twig', [
            'page_title' => 'Données du système',
            'breadcrumb' => ['Paramètres', 'Données du système'],
            "sidebar_code" => ['PARAMS', 'SYST', ''],
            "url_post_item" => ApiConstant::URL_POST_SYSTEM_PARAMS,
            "url_put_item_logo" => ApiConstant::URL_PUT_SYSTEM_PARAMS_LOGO,
        ]);
    }

    /**
     * Afficher l'interface d'affichage et de mise à jour des données de paramètres du système
     *
     * @return Response
     */
    #[Route('/system-params/update', name: 'parametre_update')]
    public function updateSystemParam(): Response
    {
        $param = null; $emcef = null; $users = null;
        try {
            // Tentative de récupération du paramètre du système
            $param = $this->apiService->get(ApiConstant::URL_GET_SYSTEM_PARAMS);
            // Tentative de récupération des infos du emcef
            // $emcef = $this->apiService->get(ApiConstant::URL_GET_EMCEF_INFOS);
            // Tentative de récupération des utilisateurs de l'application
            $users = $this->apiService->getToArray(ApiConstant::URL_LIST_USER);
        } catch (TransportException $th) {
            throw $th;
            //dd($th);
        }
        return $this->render('parametre/system-params.html.twig', [
            'page_title' => 'Paramètres du système',
            'breadcrumb' => ['Paramètres', 'Paramètres du système'],
            "sidebar_code" => ['PARAMS', 'SYSTU', ''],
            "url_get_item" => ApiConstant::URL_GET_SYSTEM_PARAMS,
            "url_put_item" => ApiConstant::URL_PUT_SYSTEM_PARAMS,
            "url_put_item_logo" => ApiConstant::URL_PUT_SYSTEM_PARAMS_LOGO,
            "url_get_emcef_infos" => ApiConstant::URL_GET_EMCEF_INFOS,
            "param" => $param,
            "emcef" => $emcef,
            "users" => $users,
        ]);
    }
}