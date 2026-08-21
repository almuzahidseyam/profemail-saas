param (
    [Parameter(Mandatory=$true)][string]$message,
    [Parameter(Mandatory=$true)][string]$date
)

$env:GIT_AUTHOR_DATE = $date
$env:GIT_COMMITTER_DATE = $date

git add .
git commit -m $message
