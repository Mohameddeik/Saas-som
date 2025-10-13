package so.daato.kulmiyedata

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import so.daato.kulmiyedata.ui.screens.HomeScreen
import so.daato.kulmiyedata.ui.theme.KulmiyeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            KulmiyeTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    KulmiyeApp()
                }
            }
        }
    }
}

@Composable
fun KulmiyeApp() {
    val navController: NavHostController = rememberNavController()
    NavHost(navController = navController, startDestination = "home") {
        composable("home") { HomeScreen(onNavigate = { /* TODO */ }) }
        composable("search") { PlaceholderScreen("Search") }
        composable("billing") { PlaceholderScreen("Billing") }
        composable("offers") { PlaceholderScreen("Offers") }
        composable("profile") { PlaceholderScreen("Profile") }
    }
}

@Composable
fun PlaceholderScreen(title: String) {
    HomeScreen(onNavigate = {})
}

@Preview(showBackground = true)
@Composable
fun AppPreview() {
    KulmiyeTheme { KulmiyeApp() }
}
