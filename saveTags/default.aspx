<%@ Page language="C#" %>

<% Response.Buffer = false; %>

<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Import Namespace = "System" %>
<%@ Import Namespace = "System.IO" %>
<%@ Import Namespace = "System.Globalization" %>
<%@ Import Namespace = "System.Collections.Generic" %>
<%@ Import Namespace = "System.Web.Script.Serialization" %>

<%@ Import Namespace = "System.Net" %>
<%@ Import Namespace = "System.Net.Mail" %>
<%@ Import Namespace = "System.Net.Mime" %>


<%

Response.ContentType = "application/json";

SPWeb web = SPContext.Current.Web;
web.AllowUnsafeUpdates = true;

int i = 0;

string new_tag		= ""; if(Request.Form["new_tag"]		!= null) new_tag		= Request.Form["new_tag"].ToString();

SPList list_tags	= web.Lists["Теги"];
SPListItem item;
SPListItemCollection it_coll;




item = list_tags.Items.Add();

item["Title"]	= new_tag;					//Название

item.Update();

%>