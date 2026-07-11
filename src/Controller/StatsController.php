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

    #[Route('/mouvement-article', name: 'stats_mouvement_article')]
    public function mouvementArticle(): Response
    {
        return $this->render('stats/mouvement-article.html.twig', [
            'page_title' => 'Mouvement des articles',
            'breadcrumb' => ['Statistiques', 'Mouvement des articles'],
            "sidebar_code" => ['STATS', 'MA', ''],
            'menu_code' =>  ApiConstant::statsMouvementArticle,
             "url_impression_mouvement_article" => ApiConstant::URL_IMPRESSION_MOUVEMENT_ARTICLES_BY_CREATED_DATE,
        ]);
    }

    #[Route('/marge-beneficiaire', name: 'stats_marge_beneficiaire')]
    public function margeBeneficiaire(): Response
    {
        return $this->render('stats/marge-beneficiaire.html.twig', [
            'page_title' => 'Marge bénéficiaire',
            'breadcrumb' => ['Statistiques', 'Marge bénéficiaire'],
            "sidebar_code" => ['STATS', 'MBFC', ''],
            'menu_code' =>  ApiConstant::statsMargeBenefice,
             "url_get_montants" => ApiConstant::URL_GET_MONTANTS_MARGE_BENEFICIAIRE_BY_DATE,
             "url_impression_depenses" => ApiConstant::URL_IMPRESSION_DEPENSES_BY_DATE_PAYEMENT,
             "url_impression_benefices" => ApiConstant::URL_IMPRESSION_BENEFICES_BY_DATE_FACTURE,
        ]);
    }

    #[Route('/marge-beneficiaire-send', name: 'stats_marge_beneficiaire_send')]
    public function margeBeneficiaireSend(): Response
    {
        return $this->render('stats/marge-beneficiaire-send.html.twig', [
            'page_title' => 'Envoi Rapport Vente',
            'breadcrumb' => ['Statistiques', 'Envoi Rapport Vente'],
            "sidebar_code" => ['STATS', 'MBFCS', ''],
            'menu_code' =>  ApiConstant::statsEnvoiMargeBenefice,
             "url_send_marge_beneficiaire_by_date" => ApiConstant::URL_SEND_RAPPORT_MARGE_BENEFICIAIRE_BY_DATE,
             "url_print_rapport_depense_by_date" => ApiConstant::URL_PRINT_RAPPORT_DEPENSE_BY_DATE,
             "url_print_rapport_benefice_by_date" => ApiConstant::URL_PRINT_RAPPORT_BENEFICE_BY_DATE,
        ]);
    }

    #[Route('/calcul-marge-beneficiaire', name: 'stats_calcul_marge_beneficiaire')]
    public function calculmargeBeneficiaire(): Response
    {
        return $this->render('stats/calcul-marge-beneficiaire.html.twig', [
            'page_title' => 'Calcul Marge Bénéficiaire',
            'breadcrumb' => ['Statistiques', 'Calcul Marge Bénéficiaire'],
            "sidebar_code" => ['STATS', 'CMBFC', ''],
            'menu_code' =>  ApiConstant::statsCalculMargeBenefice,
             "url_calcul_benefice_by_date" => ApiConstant::URL_CALCUL_BENEFICE_BY_DATE,
        ]);
    }
}
