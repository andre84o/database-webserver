Add-Type -AssemblyName System.Drawing
$imgPath = "public\logo-b.png"
if(-Not (Test-Path $imgPath)){
    Write-Host 'MISSING'
    exit 2
}
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$w=$bmp.Width; $h=$bmp.Height
$sr=0; $sg=0; $sb=0
for($x=0; $x -lt $w; $x++){
    for($y=0; $y -lt $h; $y++){
        $c = $bmp.GetPixel($x,$y)
        $sr += $c.R; $sg += $c.G; $sb += $c.B
    }
}
$pixels = $w * $h
$avgR = [math]::Round($sr / $pixels)
$avgG = [math]::Round($sg / $pixels)
$avgB = [math]::Round($sb / $pixels)
function to-hex($v){ $h = [System.Convert]::ToString([int]$v,16); return $h.PadLeft(2,'0').ToUpper() }
$hex = "#" + (to-hex $avgR) + (to-hex $avgG) + (to-hex $avgB)
Write-Host $hex
