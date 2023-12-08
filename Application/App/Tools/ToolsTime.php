<?php namespace Tools;
use DateTime;
use Exception;

class ToolsTime
{
    public static function DateCreate(string $DateString): string
    {
        try {
            $DateFormat = "j/n/Y";
            $dateTimeObject = DateTime::createFromFormat($DateFormat, $DateString);
            if ($dateTimeObject) {
                return $dateTimeObject->format('Y-m-d');
//             $yourObject->yourDateTimeProperty->format('Y-m-d')
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }
    public static function DateCreateObject(string $DateString): DateTime|false
    {
        try {
            $DateFormat = "j/n/Y";
            $dateTimeObject = DateTime::createFromFormat($DateFormat, $DateString);
            if ($dateTimeObject) {
                return $dateTimeObject;
//             $yourObject->yourDateTimeProperty->format('Y-m-d')
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }
    public static function JalaliToGregorian($jalaliDate): string
    {
        list($jalaliYear, $jalaliMonth, $jalaliDay) = explode('-', $jalaliDate);

        $jalaliYear = intval($jalaliYear);
        $jalaliMonth = intval($jalaliMonth);
        $jalaliDay = intval($jalaliDay);
        $Convertor = function ($jy, $jm, $jd, $mod = '')
        {
            if ($jy > 979) {
                $gy = 1600;
                $jy -= 979;
            } else {
                $gy = 621;
            }

            $days = (365 * $jy) + (((int)($jy / 33)) * 8) + ((int)((($jy % 33) + 3) / 4)) + 78 + $jd + (($jm < 7) ? ($jm - 1) * 31 : (($jm - 7) * 30) + 186);
            $gy += 400 * ((int)($days / 146097));
            $days %= 146097;
            if ($days > 36524) {
                $gy += 100 * ((int)(--$days / 36524));
                $days %= 36524;
                if ($days >= 365) $days++;
            }
            $gy += 4 * ((int)(($days) / 1461));
            $days %= 1461;
            $gy += (int)(($days - 1) / 365);
            if ($days > 365) $days = ($days - 1) % 365;
            $gd = $days + 1;
            foreach (array(0, 31, ((($gy % 4 == 0) and ($gy % 100 != 0)) or ($gy % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31) as $gm => $v) {
                if ($gd <= $v) break;
                $gd -= $v;
            }

            return ($mod === '') ? array($gy, $gm, $gd) : $gy . $mod . $gm . $mod . $gd;
        };
        return $Convertor($jalaliYear , $jalaliMonth , $jalaliDay , '-');
    }
    public static function GregorianToJalali($GregorianDate): string
    {

        list($GregorianYear, $GregorianMonth, $GregorianDay) = explode('-', $GregorianDate);

        $jalaliYear = intval($GregorianYear);
        $jalaliMonth = intval($GregorianMonth);
        $jalaliDay = intval($GregorianDay);
        $Convertor = function ($g_y, $g_m, $g_d , $mod = '') {
            $g_days_in_month = array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            $j_days_in_month = array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);

            $gy = $g_y - 1600;
            $gm = $g_m - 1;
            $gd = $g_d - 1;

            $g_day_no = 365 * $gy + floor(($gy + 3) / 4) - floor(($gy + 99) / 100) + floor(($gy + 399) / 400);

            for ($i = 0; $i < $gm; ++$i) {
                $g_day_no += $g_days_in_month[$i];
            }

//            if (4 <= 3)
//            {
//                $gm = 2;
//            }

            if ($gm > 1 && (($gy % 4 == 0 && $gy % 100 != 0) || ($gy % 400 == 0))) {
                /* leap and after Feb */
                ++$g_day_no;
            }

            $g_day_no += $gd;
            $j_day_no = $g_day_no - 79;
            $j_np = floor($j_day_no / 12053);
            $j_day_no %= 12053;
            $jy = 979 + 33 * $j_np + 4 * floor($j_day_no / 1461);
            $j_day_no %= 1461;

            if ($j_day_no >= 366) {
                $jy += floor(($j_day_no - 1) / 365);
                $j_day_no = ($j_day_no - 1) % 365;
            }
            $j_all_days = $j_day_no + 1;

            for ($i = 0; $i < 11 && $j_day_no >= $j_days_in_month[$i]; ++$i) {
                $j_day_no -= $j_days_in_month[$i];
            }

            $jm = $i + 1;
            $jd = $j_day_no + 1;
            return ($mod === '') ? array($jy, $jm, $jd, $j_all_days) : $jd . $mod . $jm . $mod . $jy;
        };
        return  $Convertor($jalaliYear , $jalaliMonth , $jalaliDay , '/');
    }

    public static function CheckTimeAgo($GregorianDate)
    {
        $desiredDate = $GregorianDate;
        $desiredDateTime = DateTime::createFromFormat('Y-m-d', $desiredDate);
        $currentDateTime = new DateTime();
        if ($desiredDateTime > $currentDateTime) {
           return $GregorianDate;
        } else {
            return false;
        }
    }
}