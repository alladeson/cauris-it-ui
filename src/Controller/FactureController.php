<?php

namespace App\Controller;

use App\Service\ApiConstant;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[ Route( '/factures' ) ]

class FactureController extends AbstractController {

    /**
     * Affichage de l'interface d'établissement d'une facture
     *
     * @return Response
     */
    #[ Route( '/facture-vente', name:'new_facture_vente' ) ]
    function createfactureVente(): Response {
        return $this->fvRender();
    }

    #[ Route( '/facture-vente/{id}', name:'update_facture_vente' ) ]
    function updateFactureVente($id): Response {
        return $this->fvRender($id);
    }

    /**
     * Pour afficher la page de création et de mise à jour de la facture
     *
     * @param int $id
     * @return Response
     */
    function fvRender($id = null): Response {
        return $this->render( 'facture/facture-vente.html.twig', [
            'page_title' => 'Facture Ventes',
            'breadcrumb' => [ 'Facture', 'Facture Ventes' ],
            'sidebar_code' => [ 'FACT', 'FACTV', '' ],
            'menu_code' =>  ApiConstant::facturationFV,
            //  Facture
            'url_post_item' => ApiConstant::URL_POST_FACTURE,
            'url_put_item' => ApiConstant::URL_PUT_FACTURE,
            'url_get_item' => ApiConstant::URL_GET_FACTURE,
            'url_get_detail_facture' => ApiConstant::URL_GET_DETAIL_FACTURE,
            'url_delete_item' => ApiConstant::URL_DELETE_DETAIL_FACTURE,            
            'url_valider_detail_facture' => ApiConstant::URL_VALIDER_DETAIL_FACTURE,
            'url_valider_facture' => ApiConstant::URL_VALIDER_FACTURE,
            'url_list_type_facture_vente' => ApiConstant::URL_LIST_TYPE_FACTURE_VENTE,
            'url_list_type_paiement' => ApiConstant::URL_LIST_TYPE_PAIEMENT,
            'url_imprimer_facture' => $_ENV[ 'API_BASE_URL' ] . ApiConstant::URL_IMPRIMER_FACTURE,
            'facture_id' => $id,
            // Client
            'url_list_client' => ApiConstant::URL_LIST_CLIENT,
            'url_get_client' => ApiConstant::URL_GET_CLIENT,
            'url_post_client' => ApiConstant::URL_POST_CLIENT,
            'url_put_client' => ApiConstant::URL_PUT_CLIENT,
            'url_get_facture_client' => ApiConstant::URL_GET_FACTURE_CLIENT,
            // Article
            "url_list_categorie_article" => ApiConstant::URL_LIST_CATEGORIE_ARTICLE,
            'url_list_article' => ApiConstant::URL_LIST_ARTICLE,
            'url_get_article' => ApiConstant::URL_GET_ARTICLE,
            'url_post_article' => ApiConstant::URL_POST_ARTICLE,
            'url_put_article' => ApiConstant::URL_PUT_ARTICLE,
             // Taxe
            'url_list_taxe' => ApiConstant::URL_LIST_TAXE_IMPOT,
            'url_get_taxe' => ApiConstant::URL_GET_TAXE,
            'url_list_taxe_aib' => ApiConstant::URL_LIST_TAXE_AIB,            
        ] );
    }

    /**
     * Affichage de l'interface de création de la facture d'avoir
     *
     * @return Response
     */
    #[ Route( '/facture-avoir/new', name:'new_facture_avoir' ) ]
    function createFactureAvoir(): Response {
        return $this->render( 'facture/new-facture-avoir.html.twig', [
            'page_title' => "Facture d'avoir",
            'breadcrumb' => [ 'Facture', "Facture d'avoir" ],
            'sidebar_code' => [ 'FACT', 'NFA', '' ],
            'menu_code' =>  ApiConstant::facturationFA,
            'url_post_item' => ApiConstant::URL_POST_FACTURE_AVOIR,
            'url_list_type_facture_avoir' => ApiConstant::URL_LIST_TYPE_FACTURE_AVOIR,
            'url_list_facture_autocomplete' => ApiConstant::URL_LIST_FACTURE_AUTOCOMPLETE,
            'url_get_facture_by_ref' => ApiConstant::URL_GET_FACTURE_BY_REF,
            'url_detail_facture_avoir' => ApiConstant::URL_DETAIL_FACTURE_AVOIR,
        ] );
    }


    #[ Route( '/{id}/details', name:'facture_details') ]
    public function factureDetails($id): Response
    {
        return $this->render('facture/facture-avoir.html.twig', [
            'page_title' => "Détails de la facture",
            'breadcrumb' => [ 'Facture', "Détails de la facture" ],
            'sidebar_code' => [ 'FACT', 'NFA', '' ],
            'url_post_item' => ApiConstant::URL_POST_FACTURE,
            'url_put_item' => ApiConstant::URL_PUT_FACTURE,
            'url_get_item' => ApiConstant::URL_GET_FACTURE,
            'url_delete_item' => ApiConstant::URL_DELETE_DETAIL_FACTURE,
            'url_list_client' => ApiConstant::URL_LIST_CLIENT,
            'url_get_client' => ApiConstant::URL_GET_CLIENT,
            'url_get_facture_client' => ApiConstant::URL_GET_FACTURE_CLIENT,
            'url_list_article' => ApiConstant::URL_LIST_ARTICLE,
            'url_get_article' => ApiConstant::URL_GET_ARTICLE,
            'url_get_detail_facture' => ApiConstant::URL_GET_DETAIL_FACTURE,
            'url_valider_detail_facture' => ApiConstant::URL_VALIDER_DETAIL_FACTURE,
            'url_valider_facture' => ApiConstant::URL_VALIDER_FACTURE,
            'url_list_taxe' => ApiConstant::URL_LIST_TAXE_IMPOT,
            'url_get_taxe' => ApiConstant::URL_GET_TAXE,
            'url_list_taxe_aib' => ApiConstant::URL_LIST_TAXE_AIB,
            'url_list_type_facture_vente' => ApiConstant::URL_LIST_TYPE_FACTURE_VENTE,
            'url_list_type_paiement' => ApiConstant::URL_LIST_TYPE_PAIEMENT,
            'url_imprimer_facture' => $_ENV[ 'API_BASE_URL' ] . ApiConstant::URL_IMPRIMER_FACTURE,
            "facture_id" => $id,
            'url_valider_facture_avoir' => ApiConstant::URL_VALIDER_FACTURE_AVOIR,
        ]);
    }

    /**
     * @Route("/liste-factures", name="liste_facture")
     */
    public function listeFacture(): Response
    {
        return $this->render('facture/liste_facture.html.twig', [
            'page_title' => 'Liste des Factures',
            'breadcrumb' => ['Facture', 'Liste Factures'],
            "sidebar_code" => ['FACT', 'LSTF', ''],
            'menu_code' =>  ApiConstant::facturationListe,
            "url_list_item" => ApiConstant::URL_LIST_FACTURE,
            "url_list_item_by_type" => ApiConstant::URL_LIST_FACTURE_BY_TYPE,
            "url_list_item_by_type_created_date" => ApiConstant::URL_LIST_FACTURE_BY_TYPE_CREATED_DATE,
            "url_list_item_by_type_confirmed_date" => ApiConstant::URL_LIST_FACTURE_BY_TYPE_CONFIRMED_DATE,
            "url_list_item_by_created_date" => ApiConstant::URL_LIST_FACTURE_BY_CREATED_DATE,
            "url_list_item_confirmed_date" => ApiConstant::URL_LIST_FACTURE_BY_CONFIRMED_DATE,
            "url_get_item" => ApiConstant::URL_GET_FACTURE,
            "url_delete_item" => ApiConstant::URL_DELETE_FACTURE,
            "url_list_type_facture" => ApiConstant::URL_LIST_TYPE_FACTURE,
        ]);
    }

    #[Route('/clients', name: 'facture_client')]
    function client(): Response
    {
        return $this->render('facture/client.html.twig', [
            'page_title' => 'Clients',
            'breadcrumb' => ['Gestion de Stock', 'Clients'],
            "sidebar_code" => ['FACT', 'CLT', ''],
            'menu_code' => ApiConstant::facturationClient,
            "url_list_item" => ApiConstant::URL_LIST_CLIENT,
            "url_post_item" => ApiConstant::URL_POST_CLIENT,
            "url_put_item" => ApiConstant::URL_PUT_CLIENT,
            "url_get_item" => ApiConstant::URL_GET_CLIENT,
            "url_delete_item" => ApiConstant::URL_DELETE_CLIENT,
        ]);
    }
}
