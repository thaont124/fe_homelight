package homelight;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/fe")
public class AdminController {
    @GetMapping("/login")
    public String login(){
        return "admin/login";
    }


    @GetMapping("/product/viewAll")
    public String viewProduct(){
        return "admin/product/viewProduct";
    }

    @GetMapping("/product/edit/{idProduct}")
    public String editProduct(){
        return "admin/product/editProduct";
    }

    @GetMapping("/product/add")
    public String addProduct(){
        return "admin/product/addProduct";
    }
    @GetMapping("/product/search/{key}")
    public String searchProductByName(){
        return "admin/product/searchProductByName";
    }

    @GetMapping("/product/byCategory/{idCategory}")
    public String searchProductByCategory(){
        return "admin/product/searchProductByCategory";
    }


    @GetMapping("/category/viewAll")
    public String viewCategory(){
        return "admin/category/listCategory";
    }

    @GetMapping("/category/add")
    public String addCategory(){
        return "admin/category/addCategory";
    }

    @GetMapping("/order/viewAll")
    public String viewOrder(){
        return "admin/orderManage";
    }
}

