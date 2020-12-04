<%@ Page language="C#" aspcompat="true"%>
<% string title = "Библиотека документов"; %>

<!--#include virtual="/inc/top.aspx"-->

<script type="text/javascript" language="JavaScript" src="/JavaScript/function.js"></script>
<script type="text/javascript" language="JavaScript" src="jquery.prettytag.js"></script>
<script type="text/javascript" language="JavaScript" src="tagify.min.js"></script>
<link rel="stylesheet" href="tagify.css" />

<div ng-app="App">

	<div ng-controller="list">

		<ng-include src="'menu.html'"></ng-include>

		<ng-include src="'list.html'"></ng-include>

		<ng-include src="'edit.html'"></ng-include>

	</div>

</div>


<!--#include virtual="/inc/bottom.aspx"-->