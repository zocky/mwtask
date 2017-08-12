#!/bin/bash

SCRIPTPATH=$( cd $(dirname $0)/.. ; pwd -P )
SCRIPT="node $SCRIPTPATH/simple.js"

TEST=$( cd $(dirname $0)/$1 ; pwd -P )
M1="$TEST/M1.txt"
M2="$TEST/M2.txt"
M3="$TEST/M3.txt"
O1="$TEST/O1.html"
O2="$TEST/O2.html"

RED=`echo -e "setf 1\nrev" | tput -S`
GREEN=`echo -e "setf 2\nrev" | tput -S`
BOLD=`tput bold`
NC=`tput sgr0`

test_equal() {
  if ! cmp ${!1} ${!2} >/dev/null 2>&1
  then
    echo -e $RED[failed]$NC $1 and $2 are not the same
  else 
    echo -e $GREEN[passed]$NC $1 and $2 are the same
  fi
}

echo
echo -e $BOLD$(cat $TEST/description)$NC
read -p "Press any key to run test"

echo
echo -e Convert text to HTML and back

set -x
$SCRIPT --toHtml $M1 $O1
$SCRIPT --fromHtml $O1 $M2
{ set +x; } 2>/dev/null

test_equal M1 M2

echo
echo -e Re-convert new text to HTML and back
set -x
$SCRIPT --toHtml $M2 $O2
$SCRIPT --fromHtml $O2 $M3
{ set +x; } 2>/dev/null

test_equal O1 O2
test_equal M2 M3


