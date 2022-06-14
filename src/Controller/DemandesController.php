<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ApiConstant;

#[Route('/demandes')]
class DemandesController extends AbstractController
{
    #[Route('/liste', name: 'demandes_list')]
    public function demandesList(): Response
    {
        return $this->render('demandes/list-demandes.html.twig', [
            'page_title' => 'Liste des demandes',
            'breadcrumb' => ['Demandes', 'Liste des demandes'],
            "sidebar_code" => ['DEMANDES', 'DMDLST', ''],
            'menu_code' =>  ApiConstant::demandesList,
            "url_list_item" => ApiConstant::URL_LIST_DEMANDES,
            "url_post_item" => ApiConstant::URL_POST_DEMANDES,
            "url_get_item" => ApiConstant::URL_GET_DEMANDES,
            "url_put_item_serial_key" => ApiConstant::URL_PUT_DEMANDES_SERIAL_KEY,
            "url_put_item_files" => ApiConstant::URL_PUT_DEMANDES_FILES,
            "url_put_item_status" => ApiConstant::URL_PUT_DEMANDES_STATUS,
            "url_delete_item" => ApiConstant::URL_DELETE_DEMANDES,
            "url_get_serial_key_by_key" => ApiConstant::URL_GET_SERIAL_KEY_BY_KEY,
            "url_get_serial_keys_autocomplete" => ApiConstant::URL_GET_SERIAL_KEYS_AUTOCOMPLETE_DEMANDE,
            "url_list_serial_keys" => ApiConstant::URL_LIST_SERIAL_KEYS_DEMANDE,
        ]);
    }

    #[Route('/parametre/liste', name: 'parametre_list')]
    public function parametreList(): Response
    {
        return $this->render('parametre/list-parametre.html.twig', [
            'page_title' => 'Paramètres des contribuables',
            'breadcrumb' => ['Demandes', 'Paramètres des contribuables'],
            "sidebar_code" => ['DEMANDES', 'PARAMLST', ''],
            'menu_code' =>  ApiConstant::parametreList,
            "url_list_item" => ApiConstant::URL_LIST_SYSTEM_PARAMS,
            "url_get_item" => ApiConstant::URL_GET_SYSTEM_PARAMS,
        ]);
    }
}
