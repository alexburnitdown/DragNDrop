<%@ Page language="C#" %>


<% Response.Buffer = false; %>

<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Import Namespace = "System" %>
<%@ Import Namespace = "System.Globalization" %>
<%@ Import Namespace = "System.Collections.Generic" %>
<%@ Import Namespace = "Microsoft.SharePoint.Utilities" %>
<%@ Import Namespace = "Newtonsoft.Json.Linq" %>
<%@ Import Namespace = "System.Web.Script.Serialization" %>

<%

Response.Buffer = false;
//Response.ContentType = "application/json";

SPWeb web = SPContext.Current.Web;
//web.AllowUnsafeUpdates = true;

int i = 0;
string st = "";
string q = "";

SPListItemCollection it_coll;

SPList list_tags  = web.Lists["Теги"];


// int		row_amount 	= 50;
// string	last_id		= "1000000";
// string	id			= "";
// string	search		= "";
// string	name		= "";
// string	tag			= "";
// string	author		= "";
// string	editor		= "";
// string	dt_from		= "";
// string	dt_to		= "";

// if(Request.QueryString["search"]	!= null) search		= Request.QueryString["search"].ToString();
// if(Request.QueryString["name"]		!= null) name		= Request.QueryString["name"].ToString();
// if(Request.QueryString["tag"]		!= null) tag		= Request.QueryString["tag"].ToString();
// if(Request.QueryString["author"]	!= null) author		= Request.QueryString["author"].ToString();
// if(Request.QueryString["editor"]	!= null) editor		= Request.QueryString["editor"].ToString();
// if(Request.QueryString["dt_from"]	!= null) dt_from	= Request.QueryString["dt_from"].ToString();
// if(Request.QueryString["dt_to"]		!= null) dt_to		= Request.QueryString["dt_to"].ToString();
// if(Request.QueryString["last_id"]	!= null) last_id	= Request.QueryString["last_id"].ToString();


// SPQuery query = new SPQuery();

// 	q  = "<Where>";

// 	if(dt_from	!= "" && dt_to != ""){q += " <And>";};
// 	if(name		!= ""){q += " <And>";};
// 	if(tag		!= ""){q += " <And>";};
// 	if(author	!= ""){q += " <And>";};
// 	// if(editor	!= ""){q += " <And>";};
// 	if(search	!= ""){q += " <And>";};

// 	if(last_id == "")
// 	{
// 		q += "<Neq>";
// 		q += "<FieldRef Name='ID'/>";
// 		q += "<Value Type='Counter'>0</Value>";
// 		q += "</Neq>";
// 	} else {
// 		q += "<Lt>";
// 		q += "<FieldRef Name='ID'/>";
// 		q += "<Value Type='Counter'>" + last_id + "</Value>";
// 		q += "</Lt>";
// 	}

// 	//Поиск
// 	if(search != "")
// 	{
// 		q += "<Or>";

// 		//Название
// 		q += "  <Contains>";
// 		q += "   <FieldRef Name='FileLeafRef'/>";
// 		q += "   <Value Type='File'>" + search + "</Value>";
// 		q += "  </Contains>";
// 		//Тег
// 		q += "  <Eq>";
// 		q += "   <FieldRef Name='_x0422__x0435__x0433_'/>";
// 		q += "   <Value Type='Text'>" + search + "</Value>";
// 		q += "  </Eq>";
// 		q += "</Or>";

// 		q += "</And>";
// 	};

// 	//Ком создан
// 	if(author != "")
// 	{
// 		//string author_id = getSPUserId(author);
// 		q += "  <Eq>";
// 		q += "   <FieldRef Name='Author' LookupId='TRUE'/>";
// 		q += "   <Value Type='Lookup'>" + author + "</Value>";
// 		q += "  </Eq>";
// 		q += "</And>";
// 	};

	//Кем изменен
	// if(editor != "")
	// {
	// 	q += "  <Eq>";
	// 	q += "   <FieldRef Name='Editor' LookupId='TRUE'/>";
	// 	q += "   <Value Type='User'>" + editor + "</Value>";
	// 	q += "  </Eq>";
	// };

	//Период
	// if(dt_from != "" && dt_to != "")
	// {
	// 			string dt_from_format = (SPUtility.CreateISO8601DateTimeFromSystemDateTime(Convert.ToDateTime(dt_from)));
	// 			string dt_to_format   = (SPUtility.CreateISO8601DateTimeFromSystemDateTime(Convert.ToDateTime(dt_to)));

	// 			q += "<And>";
	// 			q += " <Geq>";
	// 			q += "  <FieldRef Name='Created'/>";
	// 			q += "  <Value Type='DateTime'>" + dt_from_format + "</Value>";
	// 			q += " </Geq>";
	// 			q += " <Leq>";
	// 			q += "  <FieldRef Name='Created'/>";
	// 			q += "  <Value Type='DateTime'>" + dt_to_format + "</Value>";
	// 			q += " </Leq>";
	// 			q += "</And>";
	// 			q += "</And>";
	// }

	// q += "</Where>";
	// q += "<OrderBy>";
	// q += " <FieldRef Name='ID' Ascending='False'/>";
	// q += "</OrderBy>";

	//Response.Write("<textarea cols=80 rows=10>" + q + "</textarea>");

// query.Query = q;

//Response.Write("<pre><code>" + q + "</code></pre>");

// query.ViewFields = string.Concat(
// 				   "<FieldRef Name='ID' />",
// 				   "<FieldRef Name='_x2116__x0020__x043f__x002e__x04' />",		// №п.п.
// 				   "<FieldRef Name='Title' />",									// Название
// 				   "<FieldRef Name='_x041d__x043e__x043c__x0435__x04' />",		// Лот
// 				   "<FieldRef Name='_x0414__x0430__x0442__x0430__x00' />",		// Дата размещения
// 				   "<FieldRef Name='_x041f__x0440__x043e__x0434__x04' />",		// Организация продавец
// 				   "<FieldRef Name='_x041e__x0442__x0432__x0435__x04' />",		// Ответственный
// 				   "<FieldRef Name='_x041e__x0442__x0432__x0435__x040' />",		// Ответственный за проект
// 				   "<FieldRef Name='_x041e__x0440__x0437__x0430__x04' />",		// Организация Заказчик
// 				   "<FieldRef Name='_x041e__x0440__x0433__x043f__x04' />",		// Организация конечный Заказчик
// 				   "<FieldRef Name='_x0418__x0441__x043f__x043e__x04' />",		// Исполнители
// 				   "<FieldRef Name='_x0414__x043e__x0441__x0442__x04' />",		// Доступ
// 				   "<FieldRef Name='_x041f__x0440__x0438__x0447__x04' />",		// Причина ОТМЕНЫ
// 				   "<FieldRef Name='_x0418__x0441__x0445__x043e__x04' />",		// Исходящее (с ответом, ТКП)
// 				   "<FieldRef Name='_x0422__x0438__x043f__x0020__x04' />",		// Тип
// 				   "<FieldRef Name='Files' />",									// Файлы
// 				   "<FieldRef Name='_x041a__x043e__x043c__x043c__x04' />",		// Комментарий
// 				   "<FieldRef Name='_x0421__x0442__x0430__x0442__x04' />"		// Состояние
// 				   );

// query.RowLimit = (uint)row_amount;

it_coll = list_tags.GetItems();

string orgstt = "";
string orgst = "";


Response.Write("[");

foreach (SPListItem item in it_coll) {

	//orgstt = "";
	//orgst = "";

	st += "{";
	st += "\"id\":"				+ item["ID"].ToString()											+ "  ,";
	// st += "\"name\":\"";		if(item["FileLeafRef"]						!= null)	st += item["FileLeafRef"].ToString();					st += "\"";
	// st += "\"tag\":\"";			if(item["_x0422__x0435__x0433_"]			!= null)	st += item["_x0422__x0435__x0433_"].ToString();			st += "\",";
	st += "\"name\":\"";		if(item["Title"]							!= null)	st += prepJ(item["Title"].ToString());								st += "\" ";
	// st += "\"author\":\"";		if(item["Author"]							!= null)	st += prepJ(item["Author"].ToString());	st += "\",";
	// st += "\"editor\":\"";		if(item["Editor"]							!= null)	st += prepJ(item["Editor"].ToString());	st += "\",";
	// st += "\"created\":\""		+ item.GetFormattedValue("Created")	+ "\",";
	// st += "\"modified\":\""		+ item.GetFormattedValue("Modified")	+ "\" ";
	st += "},";

}

if(st.Length > 1) st = st.Substring(0,st.Length - 1);

Response.Write(st);

Response.Write("]");



Response.End();
%>

<!--#include virtual="/inc/functions.aspx"-->
