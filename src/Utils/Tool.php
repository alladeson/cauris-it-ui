<?php

namespace App\Utils;

class Tool
{

    
    // https://www.php.net/manual/fr/function.in-array.php#105251
    public static function in_array_field($needle, $needle_field, $haystack, $strict = false)
    {
        if ($strict) {
            foreach ($haystack as $item)
                if (isset($item[$needle_field]) && $item[$needle_field] === $needle)
                    return $item;
        } else {
            foreach ($haystack as $item)
                if (isset($item[$needle_field]) && $item[$needle_field] == $needle)
                    return $item;
        }
        return null; // false;
    }



}