<?php

namespace App\Controller;

use App\Service\ApiConstant;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/stock')]
class StockController extends AbstractController
{
    #[Route('/categorie-articles', name: 'gstk_categorie_article')]
    function CategorieArticle(): Response
    {
        return $this->render('stock/categorie-article.html.twig', [
            'page_title' => 'Catégorie Articles',
            'breadcrumb' => ['Gestion de Stock', 'Catégorie Articles'],
            "sidebar_code" => ['GSTK', 'CAP', ''],
            "menu_code" => ApiConstant::gestStockCategorie,
            "url_list_item" => ApiConstant::URL_LIST_CATEGORIE_ARTICLE,
            "url_post_item" => ApiConstant::URL_POST_CATEGORIE_ARTICLE,
            "url_put_item" => ApiConstant::URL_PUT_CATEGORIE_ARTICLE,
            "url_get_item" => ApiConstant::URL_GET_CATEGORIE_ARTICLE,
            "url_delete_item" => ApiConstant::URL_DELETE_CATEGORIE_ARTICLE,
        ]);
    }

    #[Route('/articles', name: 'gstk_article')]
    function article(): Response
    {
        return $this->render('stock/article.html.twig', [
            'page_title' => 'Articles',
            'breadcrumb' => ['Gestion de Stock', 'Articles'],
            "sidebar_code" => ['GSTK', 'A/P', ''],
            'menu_code' => ApiConstant::gestStockArticle,
            "url_list_item" => ApiConstant::URL_LIST_ARTICLE,
            "url_post_item" => ApiConstant::URL_POST_ARTICLE,
            "url_put_item" => ApiConstant::URL_PUT_ARTICLE,
            "url_get_item" => ApiConstant::URL_GET_ARTICLE,
            "url_delete_item" => ApiConstant::URL_DELETE_ARTICLE,
            "url_list_categorie_article" => ApiConstant::URL_LIST_CATEGORIE_ARTICLE,
            "url_list_taxe" => ApiConstant::URL_LIST_TAXE_IMPOT,
        ]);
    }

    #[Route('/approvisionnement', name: 'gstk_approvisionnement')]
    function approvisionnement(): Response
    {
        return $this->render('stock/approvisionnement.html.twig', [
            'page_title' => 'Approvisionnement',
            'breadcrumb' => ['Gestion de Stock', 'Approvisionnement'],
            "sidebar_code" => ['GSTK', 'APPR', ''],
            "menu_code" =>  ApiConstant::gestStockApprovisionnement,
            "url_list_item" => ApiConstant::URL_LIST_APPROVISIONNEMENT,
            "url_post_item" => ApiConstant::URL_POST_APPROVISIONNEMENT,
            "url_put_item" => ApiConstant::URL_PUT_APPROVISIONNEMENT,
            "url_get_item" => ApiConstant::URL_GET_APPROVISIONNEMENT,
            "url_delete_item" => ApiConstant::URL_DELETE_APPROVISIONNEMENT,
            "url_list_item_per_article" => ApiConstant::URL_LIST_APPROVISIONNEMENT_PAR_ARTICLE,
            "url_put_item_valider" => ApiConstant::URL_PUT_APPROVISIONNEMENT_VALIDER,
            "url_list_article" => ApiConstant::URL_LIST_ARTICLE,
            "url_get_article" => ApiConstant::URL_GET_ARTICLE,
            "url_post_article" => ApiConstant::URL_POST_ARTICLE,
            "url_put_article" => ApiConstant::URL_PUT_ARTICLE,
            "url_list_taxe" => ApiConstant::URL_LIST_TAXE_IMPOT,
            "url_get_taxe" => ApiConstant::URL_GET_TAXE,
        ]);
    }

    #[Route('/fournisseurs', name:'gstk_fournisseur')]
    function fournisseur(): Response
    {
        return $this->render('stock/fournisseur.html.twig', [
            'page_title' => 'Fournisseurs',
            'breadcrumb' => ['Gestion de Stock', 'Fournisseurs'],
            "sidebar_code" => ['GSTK', 'FNS', ''],
            "menu_code" =>  ApiConstant::gestStockFournisseur,
            "url_list_item" => ApiConstant::URL_LIST_FOURNISSEUR,
            "url_post_item" => ApiConstant::URL_POST_FOURNISSEUR,
            "url_put_item" => ApiConstant::URL_PUT_FOURNISSEUR,
            "url_get_item" => ApiConstant::URL_GET_FOURNISSEUR,
            "url_delete_item" => ApiConstant::URL_DELETE_FOURNISSEUR,
        ]);
    }
}