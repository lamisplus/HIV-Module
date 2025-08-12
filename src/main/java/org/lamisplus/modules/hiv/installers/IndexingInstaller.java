package org.lamisplus.modules.hiv.installers;
import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(16)
@Installer(name = "indexing-installer",
        description = "Install indexing",
        version = 1)
public class IndexingInstaller  extends AcrossLiquibaseInstaller {
    public IndexingInstaller() {
        super("classpath:installers/hiv/schema/indexing.xml");
    }
}
