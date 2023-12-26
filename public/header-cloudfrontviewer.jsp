<%
    String cloudFrontCountryHeader = (null != request.getHeader("CloudFront-Viewer-Country")) ? request.getHeader("CloudFront-Viewer-Country") : "US";
    String groupName = "";
    switch (cloudFrontCountryHeader) {
        case "AU":
        case "NZ":
            groupName = "Australia";
            break;
        case "CA":
            groupName = "Canada";
            break;
        case "FK":
        case "GB":
        case "GG":
        case "GI":
        case "IM":
        case "JE":
        case "MT":
            groupName = "United Kingdom";
            break;
        case "AS":
        case "GU":
        case "MH":
        case "PR":
        case "UM":
        case "US":
        case "USMIL":
        case "VI":
            groupName = "United States";
            break;
        default:
            groupName = "";
    }

    boolean isGroupNameAllowedGifting = (groupName != null && groupName.length() != 0) ? true : false;
    boolean isGroupNameUK = (groupName != null && groupName == "United Kingdom") ? true : false;
    boolean isGroupNameAU = (groupName != null && groupName == "Australia") ? true : false;
    String isAllowedGifting = (groupName != null && groupName.length() != 0) ? "true" : "false";
    String isUK = (groupName != null && groupName == "United Kingdom") ? "true" : "false";
    String isAU = (groupName != null && groupName == "Australia") ? "true" : "false";
%>
