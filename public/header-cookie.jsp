<%@ page import="com.google.common.net.InternetDomainName" %>
<%@ page import="java.net.URI" %>
<%! public static final String ATV_LOCALE = "ATVLocale";
    public static final String GB = "GB";
    public static final String IM = "IM";
    public static final String EN = "en";
    public static final String UK = "uk";
    public static final String RLJE_TEST = "rlje.test";
%><%
    Cookie cookie = null;
    Cookie[] cookies = null;
    String locale = EN;

    // Get an array of Cookies associated with the this domain
    cookies = request.getCookies();

    if (cookies != null) {
        for (int i = 0; i < cookies.length; i++) {
            cookie = cookies[i];
            if ((cookie.getName()).equals(ATV_LOCALE)) {
                locale = cookie.getValue();
                // Set locale to `uk` if you are in Great Britain
                if (isGroupNameUK) {
                    cookie.setValue(UK);
                    StringBuffer requestUrl = request.getRequestURL();
                    if (requestUrl != null) {
                        URI uri = new URI(requestUrl.toString());
                        String host = uri.getHost();
                        String topPrivateDomain;
                        if (host.contains(RLJE_TEST)) {
                            topPrivateDomain = RLJE_TEST;
                        }
                        else {
                            topPrivateDomain = InternetDomainName.from(host).topPrivateDomain().toString();
                        }
                        String cookieDomain = "." + topPrivateDomain;
                        cookie.setDomain(cookieDomain);
                    }
                    response.addCookie(cookie);
                } else {
                    // if you're no londer in Great Britain then remove `ATVLocale`
                    // so it's back to default language which is `en`
                    if (locale.equalsIgnoreCase(UK)) {
                        cookie.setValue(null);
                        cookie.setPath("/");
                        StringBuffer requestUrl = request.getRequestURL();
                        if (requestUrl != null) {
                            URI uri = new URI(requestUrl.toString());
                            String host = uri.getHost();
                            String topPrivateDomain;
                            if (host.contains(RLJE_TEST)) {
                                topPrivateDomain = RLJE_TEST;
                            }
                            else {
                                topPrivateDomain = InternetDomainName.from(host).topPrivateDomain().toString();
                            }
                            String cookieDomain = "." + topPrivateDomain;
                            cookie.setDomain(cookieDomain);
                        }
                        cookie.setMaxAge(0);
                        response.addCookie(cookie);
                    }
                }
            }
        }
    }
%>
