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
    #[ Route( '/facture-vente', name:'facture_vente' ) ]
    function factureVente(): Response {
        return $this->render( 'facture/facture-vente.html.twig', [
            'page_title' => 'Facture Ventes',
            'breadcrumb' => [ 'Facture', 'Facture Ventes' ],
            'sidebar_code' => [ 'FACT', 'FACTV', '' ],
            'url_post_item' => ApiConstant::URL_POST_FACTURE,
            'url_put_item' => ApiConstant::URL_PUT_FACTURE,
            'url_get_item' => ApiConstant::URL_GET_FACTURE,
            'url_delete_item' => ApiConstant::URL_DELETE_FACTURE,
            'url_list_client' => ApiConstant::URL_LIST_CLIENT,
            'url_get_client' => ApiConstant::URL_GET_CLIENT,
            'url_get_facture_client' => ApiConstant::URL_GET_FACTURE_CLIENT,
            'url_list_article' => ApiConstant::URL_LIST_ARTICLE,
            'url_get_article' => ApiConstant::URL_GET_ARTICLE,
            'url_get_detail_facture' => ApiConstant::URL_GET_DETAIL_FACTURE,
            'url_valider_detail_facture' => ApiConstant::URL_VALIDER_DETAIL_FACTURE,
            'url_valider_facture' => ApiConstant::URL_VALIDER_FACTURE,
            'url_list_taxe' => ApiConstant::URL_LIST_TAXE,
            'url_get_taxe' => ApiConstant::URL_GET_TAXE,
            'url_list_taxe_aib' => ApiConstant::URL_LIST_TAXE_AIB,
            'url_list_type_facture' => ApiConstant::URL_LIST_TYPE_FACTURE,
            'url_list_type_paiement' => ApiConstant::URL_LIST_TYPE_PAIEMENT,
            'url_imprimer_facture' => $_ENV[ 'API_BASE_URL' ] . ApiConstant::URL_IMPRIMER_FACTURE,
            'facture_id' => null,
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
            'url_post_item' => ApiConstant::URL_POST_FACTURE_AVOIR,
            'url_list_type_facture_avoir' => ApiConstant::URL_LIST_TYPE_FACTURE_AVOIR,
            'url_list_facture_autocomplete' => ApiConstant::URL_LIST_FACTURE_AUTOCOMPLETE,
            'url_get_facture_by_ref' => ApiConstant::URL_GET_FACTURE_BY_REF,
            'url_detail_facture_avoir' => ApiConstant::URL_DETAIL_FACTURE_AVOIR,
        ] );
    }


    #[ Route( '/facture-avoir/{id}/details', name:'facture_avoir') ]
    public function factureAvoirDetails($id): Response
    {
        return $this->render('facture/facture-avoir.html.twig', [
            'page_title' => "Facture d'avoir",
            'breadcrumb' => [ 'Facture', "Facture d'avoir" ],
            'sidebar_code' => [ 'FACT', 'NFA', '' ],
            'url_post_item' => ApiConstant::URL_POST_FACTURE,
            'url_put_item' => ApiConstant::URL_PUT_FACTURE,
            'url_get_item' => ApiConstant::URL_GET_FACTURE,
            'url_delete_item' => ApiConstant::URL_DELETE_FACTURE,
            'url_list_client' => ApiConstant::URL_LIST_CLIENT,
            'url_get_client' => ApiConstant::URL_GET_CLIENT,
            'url_get_facture_client' => ApiConstant::URL_GET_FACTURE_CLIENT,
            'url_list_article' => ApiConstant::URL_LIST_ARTICLE,
            'url_get_article' => ApiConstant::URL_GET_ARTICLE,
            'url_get_detail_facture' => ApiConstant::URL_GET_DETAIL_FACTURE,
            'url_valider_detail_facture' => ApiConstant::URL_VALIDER_DETAIL_FACTURE,
            'url_valider_facture' => ApiConstant::URL_VALIDER_FACTURE,
            'url_list_taxe' => ApiConstant::URL_LIST_TAXE,
            'url_get_taxe' => ApiConstant::URL_GET_TAXE,
            'url_list_taxe_aib' => ApiConstant::URL_LIST_TAXE_AIB,
            'url_list_type_facture' => ApiConstant::URL_LIST_TYPE_FACTURE,
            'url_list_type_paiement' => ApiConstant::URL_LIST_TYPE_PAIEMENT,
            'url_imprimer_facture' => $_ENV[ 'API_BASE_URL' ] . ApiConstant::URL_IMPRIMER_FACTURE,
            "facture_id" => $id,
            'url_valider_facture_avoir' => ApiConstant::URL_VALIDER_FACTURE_AVOIR,
        ]);
    }
}
