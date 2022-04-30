<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ApiConstant;

#[Route('/parametre')]
class ParametreController extends AbstractController
{
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
        ]);
    }

    
}