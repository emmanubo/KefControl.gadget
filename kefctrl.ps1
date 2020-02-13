$global:KefServer = $null
$global:KefPort = "50001"
$global:reader=$null 
$global:writer=$null
$global:tcpConnection=$null
$global:tcpStream=$null

function SetupConnection {

Try
    {
    Write-Host "SetupConnection"        
    $global:tcpConnection = New-Object System.Net.Sockets.TcpClient($global:KefServer, $global:KefPort)
    $global:tcpStream = $tcpConnection.GetStream()
    $global:reader = New-Object System.IO.BinaryReader($tcpStream)
    $global:writer = New-Object System.IO.BinaryWriter($tcpStream)
    $return=$true
    }
Catch
    {
    Write-Host "SetupConnection failed :  $_.Exception.Message" 
     $return=$false
    }
return $return
}
    

function CloseConnection {
Try
    {
    Write-Host "CloseConnection"
    $global:reader.Close()
    $global:writer.Close()
    $global:tcpConnection.Close()    
    }
Catch
    {
    Write-Host "CloseConnection failed :  $_.Exception.Message"      
    }
}

function IncreaseVolume {
Try
    {
	Write-Host "IncreaseVolume"
	[byte[]] $cmd_GetVolume = 0x47,0x25,0x80,0x6C
	$global:writer.Write($cmd_GetVolume, 0, $cmd_GetVolume.Length)
	$buffer=New-Object Byte[] 5
	$BytesRead=$global:reader.Read($buffer, 0, 5)
	$level=$buffer[3]
		
	[byte[]] $cmd_SetVolume = 0x53,0x25,0x81,0
	$MaxMin=[int]$level+[int]$args[0] ;
	if ($MaxMin -gt 100) {$MaxMin=100}
	if ($MaxMin -lt 0) {$MaxMin=0}
	$cmd_SetVolume[3]=$MaxMin 
	Write-Host "Volume from $level to $MaxMin"
	$global:writer.Write($cmd_SetVolume, 0, $cmd_SetVolume.Length)
    $return=$true
	}
Catch
    {
    Write-Host "IncreaseVolume failed :  $_.Exception.Message" 
   $return=$false
    }
return $return
}

function SetAux {	
Try
    {
	Write-Host "SetAux"
	[byte[]] $cmd = 0x53,0x30,0x81,0x1A,0x9B
	$global:writer.Write($cmd, 0, $cmd.Length)
    $return=$true
	}
Catch
    {
    Write-Host "SetAux failed :  $_.Exception.Message" 
    $return=$false
    }
return $return
}

function SetOptical {	
Try
    {
	Write-Host "SetOptical"
	[byte[]] $cmd = 0x53,0x30,0x81,0x1B,0x9B
	$global:writer.Write($cmd, 0, $cmd.Length)
    $return=$true
	}
Catch
    {
    Write-Host "SetOptical failed :  $_.Exception.Message" 
    $return=$false
    }
return $return
}

if ($args.count -ne 2)
	{
	Write-Host "`nsyntax : keyctrl </h:IP> <inc|dec|aux|opt>"	
	return
	}

#for ( $i = 0; $i -lt $args.count; $i++ ) 
#	{
#	write-host $args[$i]
#	}
#write-host "There are a total of $($args.count) arguments"

$a,$global:KefServer = $args[0].split(':') 

if (SetupConnection)
    {
    for ( $i = 1; $i -lt $args.count; $i++ ) {
	    switch ( $args[$i] )
	        {
        	    "inc" { if (IncreaseVolume(10)) {}    }
	            "dec" { if (IncreaseVolume(-10)) {}    }
	            "aux" { if (SetAux) {}  }
	            "opt" { if (SetOptical) {} }
	        }	    
	    }
    CloseConnection 
    }