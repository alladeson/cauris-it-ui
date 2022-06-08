<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ApiConstant;
use Symfony\Component\HttpClient\Exception\TransportException;
use App\Service\ApiDataService;

#[Route('/access')]
class AccessController extends AbstractController
{
    private $apiService;
    public function __construct(ApiDataService $apiService)
    {
        $this->apiService = $apiService;
    }
    
    #[Route('/user-groups', name: 'access_user_group')]
    public function index(): Response
    {
        return $this->render('access/user-group.html.twig', [
            'page_title' => "Groupes d'utilisateurs",
            'breadcrumb' => [ 'Accès & Audit', 'Groupes utilisateurs' ],
            'sidebar_code' => [ 'ACCESS', 'GRPU', '' ],
            'menu_code' =>  ApiConstant::accessCtrlUserGroup,
            'url_list_item_sa' => ApiConstant::URL_LIST_USER_GROUP_SA,
            'url_list_item' => ApiConstant::URL_LIST_USER_GROUP,
            'url_post_item' => ApiConstant::URL_POST_USER_GROUP,
            'url_put_item' => ApiConstant::URL_PUT_USER_GROUP,
            'url_get_item' => ApiConstant::URL_GET_USER_GROUP,
            'url_delete_item' => ApiConstant::URL_DELETE_USER_GROUP,
        ]);
    }

    /**
     * Afficher l'interface de gestion des utilisateurs
     *
     * @return Response
     */
    #[Route('/utilisateurs', name: 'access_users')]
    public function users(): Response
    {
        return $this->render('access/user.html.twig', [
            'page_title' => 'Utilisateurs',
            'breadcrumb' => ['Accès & Audit', 'Utilisateurs'],
            "sidebar_code" => ['ACCESS', 'USR', ''],
            'menu_code' =>  ApiConstant::accessCtrlUser,
            "url_list_item" => ApiConstant::URL_LIST_USER,
            "url_list_item_sa" => ApiConstant::URL_LIST_USER_SA,
            "url_post_item" => ApiConstant::URL_POST_USER,
            "url_put_item" => ApiConstant::URL_PUT_USER,
            "url_get_item" => ApiConstant::URL_GET_USER,
            "url_delete_item" => ApiConstant::URL_DELETE_USER,
            "url_put_item_password_reset" => ApiConstant::URL_PUT_USER_PASSWORD_RESET,
            "url_list_groupe_sa" => ApiConstant::URL_LIST_USER_GROUP_SA,
            "url_list_groupe" => ApiConstant::URL_LIST_USER_GROUP,
        ]);
    }

    /**
     * Afficher l'interface de gestion du profil utilisateur
     *
     * @return Response
     */
    #[Route('/utilisateurs/profil', name: 'access_users_profile')]
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
        return $this->render('access/user-profile.html.twig', [
            'page_title' => 'Profil utilisateur',
            'breadcrumb' => ['Accès & Audit', 'Profil utilisateur'],
            "sidebar_code" => ['ACCESS', 'USP', ''],
            "url_put_item" => ApiConstant::URL_PUT_USER,
            "url_get_item" => ApiConstant::URL_GET_USER,
            "url_put_item_password_reset" => ApiConstant::URL_PUT_USER_PASSWORD_RESET,
            "url_put_item_photo" => ApiConstant::URL_PUT_USER_PHOTO,
            "user" => $user
        ]);
    }

    /**
     * Afficher la liste des fonctionnalités
     *
     * @return Response
     */
    #[Route('/features', name: 'access_features')]
    public function FeaturesList(): Response
    {
        return $this->render('access/feature.html.twig', [
            'page_title' => 'Fonctionnalités',
            'breadcrumb' => ['Accès & Audit', 'Fonctionnalités'],
            "sidebar_code" => ['ACCESS', 'FEATURE', ''],
            'menu_code' =>  ApiConstant::accessCtrlFeatures,
            "url_list_item" => ApiConstant::URL_LIST_FEATURES,
            "url_list_item_sa" => ApiConstant::URL_LIST_FEATURES_SA,
            "url_get_item" => ApiConstant::URL_GET_FEATURES,
        ]);
    }

    /**
     * Afficher l'interface de gestion des accès
     *
     * @return Response
     */
    #[Route('/accesses', name: 'access_accesses')]
    public function AccessList(): Response
    {
        return $this->render('access/access.html.twig', [
            'page_title' => "Contrôle d'accès",
            'breadcrumb' => ["Accès & Audit", "Contrôle d'accès"],
            "sidebar_code" => ['ACCESS', 'ACCESS', ''],
            'menu_code' =>  ApiConstant::accessCtrlAccess,
            "url_list_item" => ApiConstant::URL_LIST_ACCESS,
            "url_list_item_sa" => ApiConstant::URL_LIST_ACCESS_SA,
            "url_list_item_by_user_group" => ApiConstant::URL_LIST_ACCESS_BY_USER_GROUP,
            "url_get_item" => ApiConstant::URL_GET_ACCESS,
            "url_post_item" => ApiConstant::URL_POST_ACCESS,
            'url_list_user_groupe_sa' => ApiConstant::URL_LIST_USER_GROUP_SA,
            'url_list_user_groupe' => ApiConstant::URL_LIST_USER_GROUP,
            "url_list_features" => ApiConstant::URL_LIST_FEATURES,
            "url_list_features_sa" => ApiConstant::URL_LIST_FEATURES_SA,
        ]);
    }

    /**
     * Afficher l'interface des audits
     *
     * @return Response
     */
    #[Route('/audit', name: 'access_audit')]
    public function AuditList(): Response
    {
        return $this->render('access/audit.html.twig', [
            'page_title' => "Audit",
            'breadcrumb' => ["Accès & Audit", "Audit"],
            "sidebar_code" => ['ACCESS', 'AUDIT', ''],
            'menu_code' =>  ApiConstant::audit,
            "url_list_item" => ApiConstant::URL_LIST_AUDIT,
            // "url_list_item_sa" => ApiConstant::URL_LIST_ACCESS_SA,
            "url_list_item_by_connected_user" => ApiConstant::URL_LIST_AUDIT_BY_CONNECTED_USER,
            "url_get_item" => ApiConstant::URL_GET_AUDIT,
            "url_list_user" => ApiConstant::URL_LIST_USER,
            "url_list_user_sa" => ApiConstant::URL_LIST_USER_SA,
        ]);
    }

    /**
     * Afficher l'interface de gestion des clé d'activation
     *
     * @return Response
     */
    #[Route('/serial-key', name: 'access_serial_key')]
    public function serialKey(): Response
    {       
        return $this->render('access/serial-key.html.twig', [
            'page_title' => 'Clés d\'activation',
            'breadcrumb' => ['Accès & Audit', 'Clés d\'activation'],
            "sidebar_code" => ['ACCESS', 'SKEY', ''],
            'menu_code' =>  ApiConstant::accessSerialKey,
            "url_list_item" => ApiConstant::URL_LIST_SERIAL_KEY,
            "url_post_item" => ApiConstant::URL_POST_SERIAL_KEY,
            "url_put_item" => ApiConstant::URL_PUT_SERIAL_KEY,
            "url_get_item" => ApiConstant::URL_GET_SERIAL_KEY,
            "url_delete_item" => ApiConstant::URL_DELETE_SERIAL_KEY,
        ]);
    }
}
