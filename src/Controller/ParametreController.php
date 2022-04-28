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
            'breadcrumb' => ['Paramètre', 'Taxe'],
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
            'breadcrumb' => ['Paramètre', 'Type de facture'],
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
            'breadcrumb' => ['Paramètre', 'Type de paiement'],
            "sidebar_code" => ['PARAMS', 'TPP', ''],
            "url_list_item" => ApiConstant::URL_LIST_TYPE_PAIEMENT,
            "url_get_item" => ApiConstant::URL_GET_TYPE_PAIEMENT,
        ]);
    }
}