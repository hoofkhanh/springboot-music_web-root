package com.hokhanh.artist.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Controller
public class MoMoController {
	 private String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
	 private String partnerCode = "MOMOBKUN20180529";
	 private String accessKey = "klm05TvNBzhg7h7j";
	 private String secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
	 private String orderInfo = "Thanh toán qua MoMo";
	 private String amount = "90000";
	 private String orderId;
	 private String redirectUrl = "http://localhost:8081/artist/eye?thanks";
	 private String ipnUrl = "http://localhost:8081/artist/eye?thanks";
	 private String extraData = "";
	 

	@GetMapping("/momo")
	public RedirectView   momo(HttpServletResponse httpServletResponse) throws IOException  {
		this.orderId = new Random().nextInt(100000) + "";
		
		Map<String, String> postData = new HashMap<>();
        postData.put("partnerCode", partnerCode);
        postData.put("accessKey", accessKey);
        postData.put("secretKey", secretKey);
        postData.put("orderId", orderId);
        postData.put("orderInfo", orderInfo);
        postData.put("amount", amount);
        postData.put("ipnUrl", ipnUrl);
        postData.put("redirectUrl", redirectUrl);
        postData.put("extraData", extraData);
        
		String requestId = String.valueOf(System.currentTimeMillis());
        String requestType = "payWithATM";
//        String extraData = postData.get("extraData");

        // Before signing HMAC SHA256 signature
        String rawHash = "accessKey=" + postData.get("accessKey") +
                "&amount=" + postData.get("amount") +
                "&extraData=" + extraData +
                "&ipnUrl=" + postData.get("ipnUrl") +
                "&orderId=" + postData.get("orderId") +
                "&orderInfo=" + postData.get("orderInfo") +
                "&partnerCode=" + postData.get("partnerCode") +
                "&redirectUrl=" + postData.get("redirectUrl") +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String secretKey = postData.get("secretKey");
        String signature = org.apache.commons.codec.digest.HmacUtils.hmacSha256Hex(secretKey, rawHash);

        Map<String, String> data = new HashMap<>();
        data.put("partnerCode", postData.get("partnerCode"));
        data.put("partnerName", "Test");
        data.put("storeId", "MomoTestStore");
        data.put("requestId", requestId);
        data.put("amount", postData.get("amount"));
        data.put("orderId", postData.get("orderId"));
        data.put("orderInfo", postData.get("orderInfo"));
        data.put("redirectUrl", postData.get("redirectUrl"));
        data.put("ipnUrl", postData.get("ipnUrl"));
        data.put("lang", "vi");
        data.put("extraData", extraData);
        data.put("requestType", requestType);
        data.put("signature", signature);

        String endpoint = this.endpoint;
        String result = execPostRequest(endpoint, new org.json.JSONObject(data).toString());
        org.json.JSONObject jsonResult = new org.json.JSONObject(result);

        // Handle the result as needed
        RedirectView redirectView = new RedirectView();
        String payUrl = jsonResult.optString("payUrl");
        redirectView.setUrl(payUrl);
        return redirectView;
	}
	
	public String execPostRequest(String url, String data) {
        try {
            URL urlObj = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) urlObj.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            os.write(data.getBytes());
            os.flush();

            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));

            StringBuilder response = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                response.append(output);
            }

            conn.disconnect();

            return response.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
	
	@GetMapping("/eye")
	public String eye() {
		return "eye";
	}
}