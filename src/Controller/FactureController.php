<?php

namespace App\Controller;

use App\Service\ApiConstant;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/facture')]
class FactureController extends AbstractController
{
    #[Route('/facture-vente', name:'facture_vente')]
function index(): Response
    {
    return $this->render('facture/facture-vente.html.twig', [
        'page_title' => 'Facture Ventes',
        'breadcrumb' => ['Facture', 'Facture Ventes'],
        "sidebar_code" => ['FACT', 'FACTV', ''],
        "url_post_item" => ApiConstant::URL_POST_FACTURE,
        "url_put_item" => ApiConstant::URL_PUT_FACTURE,
        "url_get_item" => ApiConstant::URL_GET_FACTURE,
        "url_delete_item" => ApiConstant::URL_DELETE_FACTURE,
        "url_list_client" => ApiConstant::URL_LIST_CLIENT,
        "url_get_client" => ApiConstant::URL_GET_CLIENT,
        "url_get_facture_client" => ApiConstant::URL_GET_FACTURE_CLIENT,
        "url_list_article" => ApiConstant::URL_LIST_ARTICLE,
        "url_get_article" => ApiConstant::URL_GET_ARTICLE,
        "url_get_detail_facture" => ApiConstant::URL_GET_DETAIL_FACTURE,
        "url_valider_detail_facture" => ApiConstant::URL_VALIDER_DETAIL_FACTURE,
        "url_valider_facture" => ApiConstant::URL_VALIDER_FACTURE,
        "url_list_taxe" => ApiConstant::URL_LIST_TAXE,
        "url_get_taxe" => ApiConstant::URL_GET_TAXE,
        "url_list_taxe_aib" => ApiConstant::URL_LIST_TAXE_AIB,
        "url_list_type_facture" => ApiConstant::URL_LIST_TYPE_FACTURE,
        "url_list_type_paiement" => ApiConstant::URL_LIST_TYPE_PAIEMENT,
        "url_imprimer_facture" => $_ENV["API_BASE_URL"] . ApiConstant::URL_IMPRIMER_FACTURE,
        "facture_id" => null,
    ]);
}
}