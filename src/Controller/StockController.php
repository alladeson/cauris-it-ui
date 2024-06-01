<?php

namespace App\Controller;

use App\Service\ApiConstant;
use App\Service\ApiDataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/stock')]
class StockController extends AbstractController
{
    private $apiService;
    public function __construct(ApiDataService $apiService)
    {
        $this->apiService = $apiService;
    }

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
            "menu_code" => ApiConstant::gestStockApprovisionnement,
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

    #[Route('/fournisseurs', name: 'gstk_fournisseur')]
    function fournisseur(): Response
    {
        return $this->render('stock/fournisseur.html.twig', [
            'page_title' => 'Fournisseurs',
            'breadcrumb' => ['Gestion de Stock', 'Fournisseurs'],
            "sidebar_code" => ['GSTK', 'FNS', ''],
            "menu_code" => ApiConstant::gestStockFournisseur,
            "url_list_item" => ApiConstant::URL_LIST_FOURNISSEUR,
            "url_post_item" => ApiConstant::URL_POST_FOURNISSEUR,
            "url_put_item" => ApiConstant::URL_PUT_FOURNISSEUR,
            "url_get_item" => ApiConstant::URL_GET_FOURNISSEUR,
            "url_delete_item" => ApiConstant::URL_DELETE_FOURNISSEUR,
        ]);
    }

    #[Route('/commande-fournisseur/index', name: 'gstk_cmd_fournisseur_index')]
    function commandeFournisseurIndex(): Response
    {
        return $this->render('stock/commande-fournisseur/index.html.twig', [
            'page_title' => "Bon de commande",
            'breadcrumb' => ["Gestion de Stock", "Bon de commande"],
            "sidebar_code" => ['GSTK', 'CMDF', ''],
            "menu_code" => ApiConstant::gestStockCmdFournisseur,
            "url_list_item" => ApiConstant::URL_LIST_CMD_FOURNISSEUR,
            "url_list_item_by_fournisseur" => ApiConstant::URL_LIST_CMD_BY_FOURNISSEUR,
            "url_list_fournisseur" => ApiConstant::URL_LIST_FOURNISSEUR,
            "url_get_item" => ApiConstant::URL_GET_CMD_FOURNISSEUR,
            "url_get_item_by_numero" => ApiConstant::URL_GET_CMD_FOURNISSEUR_BY_NUMERO,
            "url_get_item_by_fournisseur" => ApiConstant::URL_GET_CMD_BY_FOURNISSEUR,
            "url_delete_item" => ApiConstant::URL_DELETE_CMD_FOURNISSEUR,
            "url_imprimer_item" => ApiConstant::URL_IMPRIMER_CMD_FOURNISSEUR,
        ]);
    }

    #[Route('/commande-fournisseur/detail/{id}', name: 'gstk_cmd_fournisseur_detail', requirements: ['id' => '\d+'])]
    function commandeFournisseurDetail(int $id): Response
    {
        // Tentative de récupération du paramètre du système
        $param = $this->apiService->getSystemParams();
        // Récupération du bon de commande
        $url_get_item = str_replace("__id__", $id, ApiConstant::URL_GET_CMD_FOURNISSEUR);
        $cmdf = $this->apiService->get($url_get_item);
        // Rendre l'interface du détail
        return $this->render('stock/commande-fournisseur/detail.html.twig', [
            'page_title' => "Détail bon de commande",
            'breadcrumb' => ["Gestion de Stock", "Détail bon de commande"],
            "sidebar_code" => ['GSTK', 'CMDFD', ''],
            "menu_code" => ApiConstant::gestStockCmdFournisseur,
            "url_imprimer_item" => ApiConstant::URL_IMPRIMER_CMD_FOURNISSEUR,
            "cmdf" => $cmdf,
            "param" => $param,
        ]);
    }

    #[Route('/commande-fournisseur/new', name: 'gstk_cmd_fournisseur_new')]
    function commandeFournisseurNew(): Response
    {
        return $this->cmdfRender();
    }

    /**
     * Pour afficher la page de création et de mise à jour du bon de commande
     *
     * @param int $id
     * @return Response
     */
    function cmdfRender($id = null): Response
    {
        return $this->render('stock/commande-fournisseur/new.html.twig', [
            "page_title" => "Bon de commande",
            "breadcrumb" => ["Gestion de Stock", "Bon de commande"],
            "sidebar_code" => ['GSTK', 'CMDFN', ''],
            "menu_code" => ApiConstant::gestStockCmdFournisseur,
            // Commande Fournisseur
            "cmdf_id" => $id,
            "url_get_cmd_fournisseur" => ApiConstant::URL_GET_CMD_FOURNISSEUR,
            "url_get_item_by_fournisseur" => ApiConstant::URL_GET_CMD_BY_FOURNISSEUR,
            /* Début :  Le item ici représente le détail de la commande */
            "url_get_item" => ApiConstant::URL_GET_DETAIL_CMD_FOURNISSEUR,
            "url_post_item" => ApiConstant::URL_POST_CMD_FOURNISSEUR,
            "url_delete_item" => ApiConstant::URL_DELETE_DETAIL_CMD_FOURNISSEUR,
            /* Fin */
            "url_valider_cmd_fournisseur" => ApiConstant::URL_VALIDER_CMD_FOURNISSEUR,
            "url_put_item_infos_add" => ApiConstant::URL_PUT_CMD_FOURNISSEUR_INFOS_ADD,
            "url_put_item_expedition" => ApiConstant::URL_PUT_CMD_FOURNISSEUR_EXPEDITION,
            "url_imprimer_item" => ApiConstant::URL_IMPRIMER_CMD_FOURNISSEUR,
            //Fournisseur
            "url_list_fournisseur" => ApiConstant::URL_LIST_FOURNISSEUR,
            "url_post_fournisseur" => ApiConstant::URL_POST_FOURNISSEUR,
            "url_put_fournisseur" => ApiConstant::URL_PUT_FOURNISSEUR,
            "url_get_fournisseur" => ApiConstant::URL_GET_FOURNISSEUR,
            // Article
            "url_list_categorie_article" => ApiConstant::URL_LIST_CATEGORIE_ARTICLE,
            'url_list_article' => ApiConstant::URL_LIST_ARTICLE,
            'url_get_article' => ApiConstant::URL_GET_ARTICLE,
            'url_post_article' => ApiConstant::URL_POST_ARTICLE,
            'url_put_article' => ApiConstant::URL_PUT_ARTICLE,
            // Taxe
            'url_list_taxe' => ApiConstant::URL_LIST_TAXE_IMPOT,
            'url_get_taxe' => ApiConstant::URL_GET_TAXE,
        ]);
    }

    #[Route('/commande-fournisseur/update/{id}', name: 'gstk_cmd_fournisseur_update')]
    function updateFactureVente($id): Response
    {
        return $this->cmdfRender($id);
    }

    #[Route('/inventaire', name: 'gstk_inventaire')]
    function inventaire(): Response
    {
        return $this->render('stock/inventaire.html.twig', [
            'page_title' => 'Inventaire de stock',
            'breadcrumb' => ['Gestion de Stock', 'Inventaire de stock'],
            "sidebar_code" => ['GSTK', 'INVTR', ''],
            'menu_code' => ApiConstant::gestStockInventaire,
            "url_list_item" => ApiConstant::URL_LIST_ARTICLE,
            "url_imprimer_fiche_inventaire" => ApiConstant::URL_IMPRIMER_FICHE_INVENTAIRE,
        ]);
    }
}