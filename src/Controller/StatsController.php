<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ApiConstant;

#[Route('/stats')]
class StatsController extends AbstractController
{
    #[Route('/bilan', name: 'stats_bilan')]
    public function index(): Response
    {
        return $this->render('stats/bilan.html.twig', [
            'page_title' => 'Bilan Périodique',
            'breadcrumb' => ['Statistiques', 'Bilan Périodique'],
            "sidebar_code" => ['STATS', 'BP', ''],
            'menu_code' =>  ApiConstant::statsBilanPeriodique,
            "url_list_item" => ApiConstant::URL_LIST_FACTURE,
            "url_list_fv_confirmed_date" => ApiConstant::URL_LIST_FACTURE_VENTE_BY_CONFIRMED_DATE,
            "url_list_fa_confirmed_date" => ApiConstant::URL_LIST_FACTURE_AVOIR_BY_CONFIRMED_DATE,
            "url_list_recap_confirmed_date" => ApiConstant::URL_LIST_FACTURE_RECAP_BY_CONFIRMED_DATE,
            "url_get_item" => ApiConstant::URL_GET_FACTURE,
            "url_delete_item" => ApiConstant::URL_DELETE_FACTURE,
            "url_impression_bilan" => ApiConstant::URL_IMPRESSION_BILAN_PERIODIQUE_BY_CONFIRMED_DATE,
        ]);
    }
}
