Add-Type -AssemblyName System.Drawing
$imgPath = "public\logo-b.png"
if(-Not (Test-Path $imgPath)){
    Write-Host 'MISSING'
    exit 2
}
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$w=$bmp.Width; $h=$bmp.Height
$counts = @{}
$step = 3 # sample every 3rd pixel to speed up
for($x=0; $x -lt $w; $x += $step){
    for($y=0; $y -lt $h; $y += $step){
        $c = $bmp.GetPixel($x,$y)
        # ignore fully transparent if exists (png with alpha)
        if($c.A -eq 0){ continue }
        # ignore near-white background pixels
        if($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240){ continue }
        $hex = ('#{0:X2}{1:X2}{2:X2}' -f $c.R,$c.G,$c.B)
        if($counts.ContainsKey($hex)) { $counts[$hex] += 1 } else { $counts[$hex] = 1 }
    }
}
if($counts.Count -eq 0){ Write-Host 'NO_COLORS' ; exit 3 }
$sorted = $counts.GetEnumerator() | Sort-Object -Property Value -Descending
$top = $sorted | Select-Object -First 6
Write-Host "Top colors (hex,count):"
foreach($kv in $top){ Write-Host "$($kv.Name) : $($kv.Value)" }
# pick top as accent
$accent = $top[0].Name
# compute luminance
function hex-to-rgb($hex){ $hex = $hex.TrimStart('#'); return [int]::Parse($hex.Substring(0,2), 'Hex'), [int]::Parse($hex.Substring(2,2), 'Hex'), [int]::Parse($hex.Substring(4,2), 'Hex') }
$rgb = hex-to-rgb $accent
$R=$rgb[0]; $G=$rgb[1]; $B=$rgb[2]
$l = (0.2126*$R + 0.7152*$G + 0.0722*$B)/255
$contrast = if($l -gt 0.5) { '#0f1724' } else { '#ffffff' }
Write-Host "\nSuggested accent: $accent"
Write-Host "Suggested contrast (based on luminance=$([math]::Round($l,3))): $contrast"
