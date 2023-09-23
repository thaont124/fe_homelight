package homelight;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/fe/user")
public class HomeController {
    @GetMapping("/home")
    public String login(){
        return "home/home";
    }


    @GetMapping("/productByName/{key}")
    public String searchProductByName(){
        return "home/search";
    }

    @GetMapping("/productDetail/{idProduct}")
    public String productDetail(){
        return "home/Detail";
    }

    @GetMapping("/productByCategory/{idCategory}")
    public String searchProductByCategory(){
        return "home/productByCategory";
    }

    @GetMapping("/cart")
    public String cartView(){
        return "home/cart";
    }
}

