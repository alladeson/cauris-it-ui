<?php

namespace App\Controller;

use App\Service\ApiConstant;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/stock')]
class StockController extends AbstractController
{
    #[Route('/categorie-articles', name:'gstk_categorie_article')]
function CategorieArticle(): Response
    {
    return $this->render('stock/categorie-article.html.twig', [
        'page_title' => 'Catégorie Articles',
        'breadcrumb' => ['Gestion de Stock', 'Catégorie Articles'],
        "sidebar_code" => ['GSTK', 'CAP', ''],
        "url_list_item" => ApiConstant::URL_LIST_CATEGORIE_ARTICLE,
        "url_post_item" => ApiConstant::URL_POST_CATEGORIE_ARTICLE,
        "url_put_item" => ApiConstant::URL_PUT_CATEGORIE_ARTICLE,
        "url_get_item" => ApiConstant::URL_GET_CATEGORIE_ARTICLE,
        "url_delete_item" => ApiConstant::URL_DELETE_CATEGORIE_ARTICLE,
    ]);
}

#[Route('/articles', name:'gstk_article')]
function article(): Response
    {
    return $this->render('stock/article.html.twig', [
        'page_title' => 'Articles',
        'breadcrumb' => ['Gestion de Stock', 'Articles'],
        "sidebar_code" => ['GSTK', 'A/P', ''],
        "url_list_item" => ApiConstant::URL_LIST_ARTICLE,
        "url_post_item" => ApiConstant::URL_POST_ARTICLE,
        "url_put_item" => ApiConstant::URL_PUT_ARTICLE,
        "url_get_item" => ApiConstant::URL_GET_ARTICLE,
        "url_delete_item" => ApiConstant::URL_DELETE_ARTICLE,
        "url_list_categorie_article" => ApiConstant::URL_LIST_CATEGORIE_ARTICLE,
        "url_list_taxe" => ApiConstant::URL_LIST_TAXE,
    ]);
}

#[Route('/clients', name:'gstk_client')]
function client(): Response
    {
    return $this->render('stock/client.html.twig', [
        'page_title' => 'Clients',
        'breadcrumb' => ['Gestion de Stock', 'Clients'],
        "sidebar_code" => ['FACT', 'CLT', ''],
        "url_list_item" => ApiConstant::URL_LIST_CLIENT,
        "url_post_item" => ApiConstant::URL_POST_CLIENT,
        "url_put_item" => ApiConstant::URL_PUT_CLIENT,
        "url_get_item" => ApiConstant::URL_GET_CLIENT,
        "url_delete_item" => ApiConstant::URL_DELETE_CLIENT,
    ]);
}

#[Route('/approvisionnements', name:'gstk_approvisionnement')]
function approvisionnement(): Response
    {
    return $this->render('stock/approvisionnement.html.twig', [
        'page_title' => 'Approvisionnement',
        'breadcrumb' => ['Gestion de Stock', 'Approvisionnement'],
        "sidebar_code" => ['GSTK', 'APPR', ''],
    ]);
}
}