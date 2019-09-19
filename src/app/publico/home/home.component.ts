import {Component, OnInit, Inject, Injectable} from '@angular/core';          
import {Router} from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import {AppComponent} from './../../app.component';

import {ValoresGlobales} from './../../modelos/valoresGlobales';
import {jsonInput} from './../../modelos/servicios/input/jsonInput';
import {jsonOutput} from './../../modelos/servicios/output/jsonOutput';

import {ProductoDTO } from './../../modelos/configuracion/producto';
import {PresentacionProductoDTO } from './../../modelos/configuracion/presentacionProducto';
import {CategoriaProductoDTO } from './../../modelos/configuracion/categoriaProducto';
import {LineaProductoDTO } from './../../modelos/configuracion/lineaProducto';

import {ProductoService} from './../../servicios/configuracion/ProductoService';
import {PresentacionProductoService} from './../../servicios/configuracion/PresentacionProductoService';
import {CategoriaProductoService} from './../../servicios/configuracion/CategoriaProductoService';
import {LineaProductoService} from './../../servicios/configuracion/LineaProductoService';

import {PedidoDTO} from './../../modelos/ventas/pedido';
import {UsuarioDTO} from './../../modelos/seguridad/usuario';
import {DetallesPedidoDTO} from './../../modelos/ventas/detallePedido';

@Component({
	templateUrl: './home.component.html'
})


export class HomeComponent implements OnInit{
	public fotoDefault = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAQAAABecRxxAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADukAAA7pAQ4zQhwAAAAHdElNRQfjBwcSGRIE6IhrAAAurklEQVR42u3deZxU1Z338U9V7+z75g7KKsjmioq7gBsYMe4Gt6iTmDhZHONk8mRezmR5ZiZxsj0ziVGDiCJKRKOIGyIqrsi+CAhCs9NNs3ZDV9fzR4tB6O77q7pbFef77j982Zy699zqqu/53e3cBCKQ4AhGMoYBdKQ4gvWl2coKXmQiy0nHvfEibivjZhZQRzryn0oepFncmy/ispY8wOYYvvz1P9VMoU3cb4GIq4q4m7Wxff3TpNnFHymM+20QcdPpTI/1658mzTouj/ttcFUy7g5IrJKcyWlxd4J23KZPYjz0trutG71pGXcnKKEvR8fdCTcpANzWiU5xdwGAEk6IuwtuUgC4rTnN4+4CAIW0j7sLblIAuC2ZI5+AhM4DxCM3/vwiEgsFgIjDFAAiDlMAiDhMASDiMAWAiMN08kWato8Kqn0vpWskswxIxhQA0rTP+Q8+8b2UR+kV94ZIQxQA0rTdLGK276XsjHszpGE6BiDiMAWAiMMUACIOUwCIOEwBIOIwBYCIwxQAIg5TAIg4TAEg4jAFgIjDFAAiDlMAiDhMASDiMAWAiMN0O7A0rZTuVPpeSlncmyENUwBI0zpzK6N9L6Vb3JshDVMASNNacWbcXZDw6BiAiMMUACIOUwCIOEwBIOIwBYCIwxQAIg5TAIg4TAEg4jAFgIjDFAAiDlMAiDhMASDiMAWAiMMUACIO0+3A0rQa1rPb91K6Uxr3hkhDFADStI08wmLfS/k53ePeEGmIAkCaVsUMZvpeyn1xb4Y0TMcARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBxWGHcHApH44r/N6UYXutKFMgppAUAdVdRRwUY2Us4W9n3RNh1iP0rpQmfa054OtDvgPa5mKxvZzGY2sI1UaP0QMcrnAEiQIEEzBtOfvvSmH508X7OXz1jMQhYxl+XUkibt+ytY348iejCAvvShN8fRzPNVW1jKYhayhI+pJBVAP0Qylo8BkCBJktacxZmcziBKM3htMb3oxWggxWZm8zZvM48a6qjLoidJkpTSi2GcxWl0pSCD13agA8MASDGfWbzJLCpIUacgkOjkVwAkSFJIdy5kFGcZRtmmFNCF0YwmRTkv8yLvUEnKHANJCmjFyYzhYo7yeSSlgIEM5FukmMMUnmUVtaQUAyIHKqCEI7mbt6n5onAP8qeOjTzGSFpT9OWefMMSFNGOi/kfVlEXQk9SvMd9nEBpRvVEtoYzw6M/8zg7gPV86LGWDdwQwdZKniqkBSOZQGUoX7m//+xjEf/CiY1++ZKU0IPv8DH7Qu1Hmn08x0haUOwRR34pACSnJSimPdfwFtUhf+X+/rOF8ZxPi4N2jwpozhB+ycrI+pFmMT+gCyUhvr/nMjNHAuDmUD9HkpeK6cx3WBz6eHvoTxVTGEmrL0IgSXOGMZ5tkfejjvXcR+eQQiDJbazJiQDYwe8j2eWRvFFEe27kY/ZG/qX7ewg8zXm0pAUD+E82xNaPOlbyLTpQHPh73JMJnmufy1kBrOkDz/WsYEj0HzLJTUlaMibSsr+xn42M5w+eo2T4P7XM5XpaB3rlZoFh/E/zLqcFsK7XPNeznd/n2TkpCUkZ/fkTlbF/6XLtp4YpDKR5YO+zZfxP8zwDAljXI4Y1LWdofB86V+XavQCFdORmJjOONnF3JecUcwXTuYdOgYyUBZxl2LtPs5gtAaxtJt7XNXTiFtUAbitjKM+yM/axNpd/aniFYT4vggLoyeOGtW1jbCAH5zqYKrplOg7griRtuYG5X16fr5/GfupYz9209XWFQCG3GPb/65hEv0D+ugl+bbiGYzu/oyjuD6LEoZDuPMTm2L9c+fKznd9yrI+CuZdx/P9GRndaNKU7FYY1LuXUuD+KEr1STuav7I79a5VPPzW8zulZfj2LIh7/AZL8ylADVPG7EE53Sk5rwaW8E2DpX0s1u9hOFVVUsZ0d7KLmixtuo/xJUcNudh7Qk11UB7idKZYyJquzArbxv5JxgY3/kKAHWw1rXRLIaUcxiv+oa2vG8o/09nnNey3V7KGavexlCxVUUcU+IE2SZpTRns60oJhSSiijNLSzH3XsZQ97qGEvO9jCNnay84t7DAtoTTs60IpSSiihjDJf73+SE/gV/4cpVGX0uiLOYLhnqzSv8D7Vgb0zaVbzKPd6/p27ciNzqAlsvdKkuAOgHTfxbbpn/fo6drGDnaxnEYtZzOeUs6vBlklacxTHcwJ96Es7WtCK0sButUlTw052UMEKFrKIz1jLVmobbFvGURxHd/owgC60oCUtsgykBMfw77RhPFszeFV3zudIz1bbmMaKgN6dein+wE108GjVinMZzLuBrllyVEf+idVZFsB1VLGKD/hvruP4DL/IzRjCXUxgHmvZ5bsU38N6FjCZ73MGrTLqR5IejOUh3mPll7MCZf6zgX/MIECKGGfc/z8x8L93Ef9hOA6wjd+GegOU5IiO/Atrs/rIV1POx/yaUbT0MYYXcATXM55lPmYY2MsqnuFOeviqpVpwAb/gfdawJ4sjAav55wxOnvVivGGpW7klwP3//RL0ZJNh7Qs5I/B1S45pxz/xeRZfud2s4jluo0tA+/Et+YaPG302cz/tA3pHOnAjk1nCjoy+/p/zkwzGy2K+YRr/nwph/K9f//811gDBx4/kkDZ8m0+z+PJ/ypOMDfB6+GLO4KWsv/5p0rzFpZQF1p8Ep/MnFht3TFKs5V8zWrtt/N/CLSEV4Ql6meJ2wRfzJcphqQW3sTjDL1oNK5nIBYF+MAsZxGRfX/80aaZzXqC9SjCMv7Dc80boFOU8mNHXv5ibDTtddTwZ0vgPUMIvTTXAbwKMVckpJYwx3B/+1Y/kRl7i6gBHfoACevI/AUwyVsckhgR8PqWA0bzE+ia//uv4WYbvSG/T+L8ptPEfIEHvJrdr/898zgytDxKjQobxckZHvPcwnx/TLeBz9wm68a8BTTBaze85IfBrC1ryPeY2MidCivX84otHn1iV5MD4D1DKL1QDuCpBbx7P6Fj3JqYwPIQRqTV3BjjnwDZ+QucQ3q1TmNzAPnMdG/gPWma4NNv4v5FbQz4Jl6QP5YaezAtkLiLJKZ34hemmkP3j3Kc8yFEhzIxbyiiWBfb1T5NmBeMyHJFtWvMAS78yYtaxif/K8IoDKOEmw/ifCn38Byjj56Ya4L8DuO1ZckgzbmNJBoX1+1yT8ThnUcggpgX69U+TZiYXhHIjSyFfY/aXuwJ1bOYhWme8FNv4v4HbIrgIJ0lf0xUgwcxHKDmigLN5zXzQbQcvhlL6Q4KupivSMv1J8Wd6hTKPf5LBTGUXaerYwm9om/EScmn8B2jGzwx/gUoeUg1w+DiW/zXf8ruNJ+gf0kTRzbnBvBtSw3IWmCcnreB7tAulzwmOZQLb2MrvslqDbfxfH8n4D5Ckn2mq1Tk6F3C4aMa3zdf9b+VP9Arpjr1ChjLb/PX/gNu4khnmw5ZzuCSk+9kTdOUhfu95M01DSrnRcNgtuvEfoDn/rhrAHQmG8YrxS1TJH+gR2iOxOpnL/xo+4AZKKGYUbxgjoI4/c0JIfU9QluVlx7br/9Zxe4STcSTpbxoQPtZxgMNBZ37JdtNXaFtoe9IApVzORuPX/31u+OKK9GJG8poxAjZzZygHLv1s8w05N/4DtDDWAL8O+AIwiVwhX2e+6euzmwn0DW26jgQ9eNHUj1o+4cYDxsNiRvGm8SlFr3NaTk23novjP0CSAawy9OyjQB5OJjHqziOm5/vt40VODvEZcc253XTtXx0rufegcaeUa5hr2nmo5oGs9tTDkavjP0BL/k01wOGvhFtNz9StYzYXhXgUOkk/3jeN4Rv5GZ0OeX1bvmsasdJ8zPmxz7W0n238L+eOGCbjLOAkPjP07kPDFGaSs/rypGnkXMlNoe49t+R7pnsQtvFnTmhwCcfwS7YYllDLz+ga99sOQCnXsy5Hx3+AVjxorAHCuMpSIlDCXaarvir511C/NEn6MdfQjxpe5vRGlzKAJ0wHAxdwQU7UALbxfy3fjGky7gIGmqpD1QAhCf9g1bGcSTfPVileZRIbQuxHMy6kv2erNKt4gvca/fcFTGQB3s+568M5gc0UlL1ShnK+Z6s6ZvE2e2PpYYrPmGB4P3swWjVAPirkJlYYEn4hl4U6BiU4no8M/ajg1x5f3Lbcb5rT5hOGx34uwDb/f3zjP0ABg0yfkA84J+Z387AU9ke0G2dwjGer7TzBe6GOQaWczkmerfbxIRM8ptiu5HleN8xb349TY37CcRlDjOP/rJjGf6ivAZ4w1ADHc7lqgHyT4ArmGdL9RQaF3JOuprv/VnC7IRIL+BqfGJb2Ruhb1TTb83/XcGfMD+MqYDDLDT19XzVA8MKtAFoxuJHj6QfawGSWhdqPInobbirZzds898VTfJqS4k2mscOz3VBOjHFOmzLj/v87vBXj+A+QYqWpBjiBy3PsGsvDQLgB0JMhntM7p3mFtxt5mk9QmnGZ4VKS1TzHJtPytvAq8z1bteDsEGYJsjqKUXTxbLWON/g0tj7ut4PnWO7Zqg3DGBp3Vw83YQZAIf0Z6NmqnGmsCnUbE3TgEs9Wu3iPN8zL/Ig3DE/kG84xMR0ItO7/xz/+Q30NMNFQA/TkUtUAwQrz49mBAZ5n9tO8xochPwqymEEc79lqFVOoMC+zkteY69mqO/1jOnB1JJcaxv9yZuTA+A+wnecNPWnDmZwcd1cPL2EGwPH091z+Rl5jdcjbWMZIz37s4n1mZrTUj3nLswYo4IwGLikOn3X8f5c3c2D8B0ixgidNNcAlGc+GKE0ILwCS9KCPZ6t3mRvy+J+gDed6tlrHdLZltNwq3mapZ6vTAp/O3OJILjMcfShnhmHPOyrbecFwKFjHAQIW3oezDb08R79dzOSzkLewkH6eVyLUsoK3Ml7yJ8xjn0ebo+kZ+ZkA6/g/O2fGf6ivAZ4ynIPpxSjVAMEJLwCOoa/njb1LmGs4neZPCWd7bmUl77Eu4yVv5CPWe7QpYHBIswQ27gguN4z/a3Nq/Aeo4m+qAaIWXgAcTU/PNu+yIvQtLDVMJ7GW6Yb9z4PV8T4LPVsNjvieANv4n+I93sih8b++T7YaoLdqgOCEFQCFHMGRHm0qmRPq7T/129eBfh5t9rDEcES/IUuZ73kFQ286hzjFyaGO4ArDgcdyZkQQvpnaxkvGGkDnAgISVgC05VjPE2BLWB76GFRIX88zx5V8mOWFSLtY6Lnr0JruEc5rW8YQLvBsleL9nBv/6/u13FgDjMji0SjSgLACoCvdPSf2nM+a0LeviCGebbbyUdbLX2o4idk3wg9rN0bT0bNVOW/k4PgPsI1phnMrOg4QmLACoBNHe7SoYQkbQ9++Is9rEevYyIKsl7+c1Z4jVu/I9lit+/+5Of7X9+1TUw3QRzVAMMIKgPae1wCuZxW7Q9++Is8jADtZmsEVgAerZIXn9QM9IrsasCtjDON/7h3/P9A2XmaJZyvVAAEJJwAK6OA5L+7K0A8AQoJ2nkFUyZwszgDsV8cy1nq06UrbSA4DljHUtP//Ia95Xr8QnxTLmWSoAfpysWoA/8IJgBZ08rwL8DPjnXd+FHCc573u2w3jTVNWe+7IlNItkifudeVKw3Tka3N2/3+/Sqaz2LNVa90XEIRwAqCN4UKUz9kS+tYVcJxnm10+70XcYNiB6BbB1YDW/f8PeTWHx//6Pn7K06Ya4ELVAH6FEwAtPa9+q2ETO0PfugKO8miRopLNvtaxha2kPNp08ayH/OvCVcbxf2XoffGrkldY5NmqNWfqOIBf4QRAc89k3kqF59fGvwKO8GhRzTqfx8Or2ex5FUHn0APAOv5/lPPjf30/lzHZUAP04yLVAP6EEwDNPE98bQ39HoD6rfPaFdkdwM3IG6j0aNE+9Fn3OjPWcMnxWl7Pg/EfoJJXDZdZqwbwLawKwCsAqkKeBKxewnNXpDqAQ5EVnmHWmqJQt9N6/P9jXsmD8b++r7Ya4EQdB/AnnAAo8bz4tSqCawAg6RkAtWz3vZbdnjMatAo5ADpxteGewzW8FvrN18Gp4HVDDdCKs3QuwI9wAqDQs+TdRXUEW5fwvA+gNoAgqvY8itA81MeE2eb/TTGH6Xky/tf3d6mxBjg/5ucv5LWwLgTy+sDvjeSjmPA8/56KJACKQ50VqCPXHHbjP9TXAN4XabfiLB0HyF5YFYBXybsvgnMAgGclEkwAeIVZoeeNUdkr42TT+P8JL1MbWi/CkGIpzxhqgP6qAbIXTgAkPSuAlOEP61/C0I89vtfiXQEUhVgBdOBa2nq2WsOrIU++HoYK3jA8f0E1gA/hfDATniNe2sf195n1xKsf/oOoznNbwhv/S43j/1ym5dn4X9/vJTxr+AsN4DzVANmJ+/m14k8Hrjd89NfwSuiTr4ejghmGGqAlZ6sGyI4CIJ+Vcopp/J+Xl+N/fd8XqwYIkwIgn7XnBsNlMGuYnqfjP0AFbzLPs1VLzjbM/SSHUADkr1JO4TzPVinm8VKejv/1/V/EFEMNcJJqgGwoAPJXO24yjv+fx91VXyp40zBrcwuGqwbInAIgX5Vyqmn8n8+LeTz+12/DIv5qqgHOVQ2QKQVAvmrLzYbJRtfwcp6P/wAVzDTVAOeoBsiUAiA/lXKaafxfwN8iuuYyTCkW8pyhBhjIuYaLouQACoD81IZveN7oBGuYFsGzF6JQwUw+8WzVnHMYHHdX84sCIB+VGMf/hbxwGIz/9duygKmmGuAc1QCZUADkozbcanjWwFpe8pyyPH9Ya4BzVQNkQgGQf0o4nXM9W6VYyPOHyfhfvz22GmAQZ+tcgJ0CIP+04jaae7Zay4uUx93VQG3lLUMN0IzzVQPYKQDyTTFnmMb/RUw9jMZ/gDrmGWuA4aoBrBQA+aYVdxgeN76WFzwfXJ5/KniLOZ6tVANkQAGQX6zj/+LDbvyH+hrgBUMNMFjHAawUAPmlJXcaHjO2lucPw/EfrDVAGRcwKO6u5gcFQD4pZphp/F9ium4uH9Ux11QDDFENYKMAyCfNudvwkLFyprI+7q6GxlYDlHKhagALBUD+KOJMzvFslWKp6f75fFXHJ6YaYChnqQbwpgDIH835ludzDqCcKWyMu6uhqmQWH3u2KuFiBsbd1dynAMgXRZxlGv+XHdbjP0Adc3hRxwGCoQDIF2XcY3jGcDnPBPC401xXwVuqAYKhAMgPhZzNcM9WKT41zaGb79J8bKoBdBzAkwIgP5TxXcMThtcxmc1xdzUStuMAxYzgpLi7mtsUAPmgkOHG8f+ZiJ64FLc0H/GSoQY4WTVA0xQA+aCEfzQ8YHw9T7Ml7q5GptJ0HKCIUQyIu6u5TAGQ+wo4h7M9W6VYzmRHxn+ANB8yTTWAXwqA3FfM9ynwbLWeJ9kad1cjtY23+MizVSGXqAZonAIg1xVwnmn8/5RJDo3/AGk+4GVDDXAKZ6oGaIwCINcV8UPDX2kDT1EZd1cjV2mqAQq4jP5xdzVXKQByW5LzOMuzVYrlPBl3V2PxPtNNNYCOAzTiq8eWC+hMB8P5Zi/HegZLB/rTLvSta0vCo0UZfQz71007zvMJfQX0Ys9XflPBWvYZll3I/Z7bABuYQJXfNysvbWMmF3GyR6sklzGTWXF3NpcV0I+H2UhaP5H8jKez4a+S4BLDsmqZYXhI2OGqNQ9S6/ke1XG/aoCG1I/UpfyUj7mFTnF3R76iiPsNrTbyONvj7mpsqphpOA6Q4ApOjLuruSgJFPM/PGC40USileAihnm2qj/+77L3eNXw/GOdC2hQkiT3clPc3ZAGFGr8N6lipuGawARX0DfuruaeJF15IO5OSIPO4wzPNrUsd3z8B5jNax41QJp9dKOz4YJqxyQZZ3jKrMThFkObzfzF8fEfoIo3m6gB0uxlDb9nJFMNuwqOKWRU3F2QBhVyiWebWpZp/AdgNq8zqIET2Gn2soHJ/IllDsyTkIVCToi7C9Kgzobn/23mL+yIu6M5oYoZnMcpX/ldmhrW8zx/YtFh+JCUgBRGcDmOZKOjZ4talvF03N3MGbN5nYFfnstKU8M6/srDLNHI35RCXQyco7yvT9yq8f8AVbzJuZwK1FHNel7kYRZo5Peio6L5axtT4u5CTnmXGQwgzTqm8giLNPJbKADyVx274+5CTqniDXqwnkeZq5HfSgEgh48ZzKRGI38mFABy+KiJuwP5R4cARRymABBxWKa7AGn2UB7AIZYEHWibYfyUszPDWe8K6eExnUYN66n2vTWZW6/DVJILMg+ABfwDy3yvty3/xA20yOg13+dV9mb0ig4s9djCZdzFfN9bk7l9scSOyEEyDYAkvRjHfez0tdYiRjM8w68/7GFHhod5vB+mXccu3Uwj7sr8GEBrRnC5r7MHCfoyll5xb7qIZHMQ8BjupKePdbbjRs7S4UeR+GXzNSygP3dlPQ1lMZcwynMeXRGJQHbjcBtGcllWuwEJ+nKVyn+R3JBtIX4st9M7i9e15zrOVvkvkhuyPZhXwEncwY8zfBxFMSO5ROW/eCigGcUaJg5Sxz72mB4nk4Hsj+a3YQTv8VQGs6wl6MdVWdUN4ooEzTmaI+lBuwCeUHV4qWUbq1jNGrYHd8OTn9N5xzGOeRlcRtOBaxiuXJdGFXIk53Mtp2Z8jYgrdjOHp5nGZxleEtcoP1/HQgZzG22NrUsYwaUq/6VRhfTke/yG8/X1b1QzhvEz/plBhovcTPyNx20ZwSWmUi1BX76m8l8aleRI7uFuyuLuSM4r4zruDeChtoD/uwG7cxN9DO06cjXnqPyXRjXnUsbpE2KSZAxX0iGYRflTyFBu8ZxZuISLuFzlvzQqQTdu0fMpzYoZw4lBxKX/RbTlYkY1uRugo//ipZg+nBR3J/JKX/rRzP9igii5judG+jXx7x25SuW/NKkZg/UJyUiSnrQPYjH+FTKUmxrtTCkXqvwXD4V0jrsLeadDrlQA0I6RjGxwN6D+2n/LYUJxWTKID7NjSoOY0tcSAJZpuI7n+gZ3AzrxNc5VcSeSm7y/mjWsMCynkJO54ZATE6WczxWm8r9c8/KIRM87ACqZyDrDktozihFf2Q1I0I+xpvJ/F1MCmGdQRDLkHQDVvMUE01x8J3Ad/Q/4/85caSr/07zNM6aQEZFAWfbOK3mUWYZ2hZzKdV8+1rqUcxltKv9XMZ5FGU74LSIBsARAHZ/xO8oNLdsxkospov7o/9Wmi392MokZ7Ir7jRBxke1Ewh5mMYHvGO5A6sm1LOajDMr/d3iWcp0EEg9paoK6BTYvFFESxdkz65nErfyFwVxgWN5pXMNmhjHGVP6v5HEWqvwXTzuYzey4OxGhExkexJV+XqwBUMdK/kBvjvRs2Y5R1NHTVP7vYDJvqPwXg+1M41dxdyJC13BiFAFgLzLqdwMsD7Q6gds5z1j+TzEdWxCRUGSyl7GFCcw0tCuirempASt4ggUq/0Xik0kA1LGC/2VNQGvewbO8rvJfJE6ZHWfcbd4N8JLmbZX/InHL9ETDZiYyI4D1LudJ5qv8F4lXpgFQx3Ie5nOfa93BFF5T+S8St8zvKN7NLJ7gu5Rmvc40syIq//fxjsfcqcsVQ+KybKYU2MxTDGRE1uv8lCeZF0n5v5ufkmiyxU42RNAPkRyVTQCkWMaf6cMxWa1xB8/xOrsj2bq9vB7JekTyVHZXG9fvBuzJ4pU6+i+SQ7K93WATT/NGFq/7lKeYq6P/Irkh2wBIsZTHWJXhq7bzHK9EVP6LiKfsbzjczVtMzGg3oP7af838I5Iz/NxxvInJGR1kW8Yklf8iucRPAKRYwng+M7bezvNMV/kvkkv8PVqgfjfgXsMjnetn/lH5L9lqxQjaxN2JCEUyG4DfAICNPMsALvVsp/Jf/GnJ2ZwWdyciVGSYgC8AfgMgxWIm0JfuTbbazgu8rPJffEhQ6uPyc2mE/2kHdzOTJ5s8G5DmHZ5hfdybKiIHC2Le0Q38tcmLgpbxtMp/kVwURADUsYhHmNvIv27iaV5S+S+Si4KZeXwXr/M7FjfwL5uZyHjdcSceCmgRdxfyTrOvPIkzSwE8YRyACqawnes4l5Zf/m4vC3iSKaxU+S9NKuQ4hsbdibzTnz4szuqWvAMEFQCwhedZwhAG0Z1W1LCW+XzAIrbE/DZJ7mvLOI6IuxN5pzNX8gkL/S0kuACA3cxlGa/SlhJSbGczVRr7xVMpZzLaY+IWOVSCcxnOWqr8LCTIAADYw+e+ZwwUlyTowF3RXPV22GnLdXzIB36G2QgePyjShGZcxrC4O5G3BjOSTn4WoACQOCU5irv0bOislXEtA/zU8QoAiVMLbqRP3J3Ia8czxs8BVAWAxKeQftwc+HEotxQwhlMN9+M2QgEg8WnJnXSLuxN5rzPXZjlDNwoAiU8xw7lcp/98S3Ae55iex90AlV8Sl7Z81zDFxz7m84IT15MUcxrnZBWIrbiZ95mTzbukAJB4lHEVpxrareb3TI27s5EYyMlZ10ODuIy1bMr8hQoAiUOCbnzbMMHHbmYzhYq4uxuBlvRnSNavLuFGZlJBbaYv1DEAiUMzbud4Q7uVPObE1x8GM9rXnIfHcjVdM3+ZAkCiV0Bfxnk8txmggpd5J+7ORqITFzDU1wHRAq7ilMwnTVMASPTKuJeOnq3SfMpfnJhKJsEpjMn+XP4X2nMzR2X6IgWARK2Q87nMMNqtZ3KDk8wcfrpzGT19LyXBeV+Zj8NEASBRa8kPDfP/7GM+E9kXd2cjUMQZXBrE7D405w66Z7YjoQCQaBVzvWn2n7WMd2Qm6X6MoUtAyxrA6MxurVYASJQSdOF7FHu22827TKUu7u5GoCXDucDwPVzOPLZ7tipiHL0Mh1e/pACQKBXxHY42tFvNH9kRd2cjMZCrDfvtKabyYz4wLO8obqKzffUKAIlOgn7cYvjMVfIS78bd2Uh04gLT5T8fMI3pvGLYKUrydU62P1ZMASDRKeIBw8UuaVbyJ2ri7mwEEgzl64Yv626m8h7VTOY9w25Ra+6w32OpAJCoJBnBJYZ2G5nIsrg7G4nuXGG6HvINXmUHsIrnWWFofx7nW5+zoACQqJTxL4Yr1WpZxHhScXc2AkWcyhjDAbvN/I15pIEUzzGLvZ6vKOXbHG07HagAkGgkuY2TDO3W8b9sjruzkejD1XQwtJvGa1/uEFXwLAsMr+nLWNpaOqEAkGh05IeGe0/3MJupTtz935KzudAwSi/lbweU/Wle4w3DkwAKuZMTLKcDFQAShQQ/Mt2rVs5/+33YVZ7ozw2G2ZBTvMSMr+wQ7eEJ5hiW35nbLPWFAkCi0J9bDaNdFVN5L+6uRqIzI4yn/146ZJqPuUw3PG43wXUM9T7DoACQKDxIc882aVbx28yntMhDCU7iOsMO0W7+xtuH7BClmMiHhtOBzbjH+55LBYCE7zJGGlpt4TFWx93VSBzHVRxnaDeDl9nVwO8/ZworDa8/j4u8djMUABK2Yh40jHa1LOERJ67+L2IIVxm+eZt5qZG9/TqeYbbhdGAhP6Bb07teCgAJ2z/Qz9BqEw+xLe6uRqIXN5om/5rOtEZ3iKp4kkWmdV3f9IThCgAJV0fuM5yOqmY2z8Xd1Ui04Cwuzvj036GmM8Nwd2CCe+jR1LdcASDh+olh8i/YyM+dOPwH/bjFcDt0ium80uT1EPt4lHmG9bXjW01dEqQAkDANYJzhM7aDZ/kw7q5GohOjjKf/XmCLR5t5TGOjYVk3MrTx+YYUABKeBL80XP2fZg3/6cTVfwlO5BuG8n8X05jp2SrNo3xsOGxayH20a+wfFQASnjGcY7r7//9RHndXI3Es15mmQ3mTF6g2tCvnaT4ztDuXUY3NOawAkLCU8RPD3m4tS3kk7q5GopjBXG1ot4nppot9ASbxvmnmhAfo3HDloQCQcCT4Fr0M5e5Wfs7OuDsbiRO4xTD5V5pXecF8PcQuxrPU0K4H4xqeIUABIOHoyncN438Nb/NC3F2NREvO5GJDO6/Tfwebbro7EL7b8OlABYCEIcmP6eA5/qfZxL85cfVfgt5803A9xD5e5eWMlpziYRYaDqG24l5aH/prBYCEYQjXGsb/XTzFx3F3NRIduYxBnq3SfMjzbM1w2fN50fRg8Os55dDTgQoACV4xPzXc/VfHGn4Vd1cjUcCJ3GJot4NXDKf/DvUIcw2TqBVw/6GXICsAJHhjONNw+892fsu6uLsaiSO5niM8W9XxNs+bTv8dbB0TTfdRDufyg2cIUABI0FrzA8NcN7XM59G4uxqJEgYz1tBuE69kvUP0NO+bouNHB58OVABIsJLcTW/D4a5KfunIo7+7c4fh9F8tM3w8DG0Xj7LccCiwO3d89ZIgBYAE61huN4z/e3mTF+PuaiRacDYXGtp9apzzvzGv8rrh7kD4Nicc+K1XAEiQivgBXXX670tJenKn6XboGUzztaYUf2Sx4T1txQ8OvCRIASBBOpUrDbf/VPM4n8Td1Ui0ZwwDPVul+YTnqPC5rgU8b3qiwjWc8fdIUgBIcJpzn2GumzpW8VDcXY1EIf0YZ2hXxWvMCGB9jzKPfZ6tCvjR3/9KCgAJSoIxnGG6/Ochw7TW+S9BN242PKYzxXtMCeRhqOuYQLnhUOBZXLn/NK332VoRm478Q9PzzwFQx2qm0SnuzkagiNO4ytBuG3MoD+gdmckyuhlC+H6msZa0AkCCUsDt9DV8ntLU8OO4OxuJMvqbntFbywAeDGytrU0PVj2Ou/gpNQoACUpPbjKc7YYChpgmxXJHZ0bFsNZvMYm5pHUMQIJQync4wvZAaskJLbmPZjoIKME4g0sNt/9ILhnLcBIKAPGvBfeYnnQvuaSAH9FCASD+Dedk7+fQSs4ZxrkKAPFvhOH0n+SiaxUA4l9Pjf956lQFgPiVpJNOJ+epbgoA8auIEp0AzFMlCgARhykARBymABBxmAJAxGEKABGHKQBEHKbztxKFTeyNuwuRSVBKe482e6iMYFLUYtp7TUiqAJAoPM7auLsQmUJ6catHmxU8HkEkHsE42nl1ViR8T/BR3F2ITAkjDAHwW3aF3pPBfM0rAHQMQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxmAJAxGEKABGHKQBEHKYAEHGYAkDEYQoAEYcpAEQcpgAQcZgCQMRhCgARhykARBymABBxWGHAyyujI20pJsUONlNFOu4NFJHGBRkALejJIAZyHC2pYR0L+YiFbFIIiOSqoAIgQWcu5hrOovmXv9vHEibxLMuojXszRaQhQQVAF27gbo79yu+K6M/R9OAh5pOKe0NF5FDBHARsy+WHfP3rteZKvkn3uDdTRBoSRAAUMZRbGvz6A7TickbTJu4NFZFDBREAxzCWIU38ezeuZFjg5xtExDf/AdCWkYymoMk2g7maHnFvqogczO+4XMQQbqCjR6tiLmA+G9kW9+aKyIH8VQAJjubrTZb/+3Xja9oNEMk1/gKgjaH8328wY7UbIJJb/IzJRQziJjoYWxdzIfPZRGXcmywi+2VfASQ4imsYnMErujGW07UbIJI7sg+ANoxijLH832+QdgNEckm243ERA7nZXP7vV8xF2g0QyR3ZVgBHch2DsnhdN67WboBIrsguANowynz0/2CDuEq7ASK5IZuxuIiTGJdx+b9fMSO0GyCSG7KpAI7gRgb6WGdXvs5p2g0QiV/mAeCn/N9PZwNEckKm43ARA7iV9j7XWswI5mk3QCRumVYA3biZkwJYb1eu4RTtBojEK7MAaM0lvsv//QYxVjMFicQrkzG4iP7cRruA1lzMKOazWbsBIvHJpALoyq0MMLTbw+dsNC3vOoZqN0AkPvYAaMWlXG4q/xfwK15kr6HlQL6u3QCR+FgDoIgTud1U/pfzLOOZxMeGtsVcwgjaxv0miLjKGgCduZ3+hnZ7mMFktvIeT7PB0L4L1zNEuwEi8bAFQCsu4wpT+b+QiawEKnnBvBtwDcfF/TaIuMkSAIX05U5ToV7Os7xFHQArmWzcDbhUuwEi8bAU350Yy4mGdnt4k0ls/+L/anmXyRxLF8/XdeZGVms3QCR63hVACy7nckO7NAt5nM8O+M02nmca+wy9OIlrG32ykIiExvuL3YYrTA/2WsezzPqi/N/vM57mI8Nri7lIpwNFoucdAIV0MixnD2/xFDsO+u0+3uEZ1hte346yuN8KEfcE83RgWMx4VjXw+208x8umswEiErlgAqCcZ748+n+wz3jadDZARCIXRADsYRYTDyn/96vlbZ417QaISMSCCIAlPMbqJv69ir9qN0AkF/kPgHVMbrT830+7ASI5yW8A7OFtJrDTo1Uts5ii3QCRXOM3AJbyMGsM7bbzLNO1GyCSW/wFwHomH3LxT2NW8TRz4t5cETmQnwCo5h3Gs8vYupa3tBsgklv8BMAy/sjaDNpvZzKvaDdAJHdkHwDrmeR59P9gq5ik3QCR3JHtTbjVzOYxdmf4qhRv0p+j6Rr3ZosIZF8BLOcPlGfxup08xavaDRDJDdkFwAaeYhbprF77OU/xSdybLSKQ3S5ANbP5M3uyXGOKGQzgaMNMQSISsmwqgJX8ztfpvF08yWvaDRCJX+YBsJGJWZf/+33ORObGvekikukuQB3rWchA3+utZil9aJHRa3pSYZphMB9sYbXvbSnj1AjqqN2s+nKi1+z1pyj0nuaKInp6tmnLKVnvRNv1osSrSSLjsXwPm32O//Va0yrD+mMzewJZcy74K//G5iZbDOFDj2XsY30E78dSfsz7TbYoYQ59PJay3qFdvgRldPRos5utGV5Dk41iOnoN8ZkfBCzj6NA73jCvNzWftA/gRuyiSP4S2ykNYCm68uOrmtEs7i7UC2pOQBHJQwoAEYcpAEQcpgAQcZgCQMRhCgARhyUPm0trDjf583dJHTZXZ7hnX9LjchSJy6a4O2BWSxWpuDshWdmYZH7cfZAGbWZj3F0wW0ZN3F2QrMxPMjXuPkiDUrwQdxfM3vB8MoTkpqnJRp7qK/H7z7wZV59hGbVxd0Iy9jkTkuzke9qDy0nL+EXcXTDayb/n0TELqZfiHnYmSTOVHygCclCKn/Fo3J0wepmf6HByXknxff5GOgnU8huuNj3gS6JVzTf5YQB344evjj9zI/M0kOSJz7mK31ILBQDUsYSHWUOS5pR+8TsJ0zymm56plGI2j1FBKSU0IxFDTzfxYpMPf98vzUoeYxlpmtFMn6EctY+NzOK/uIv59fMR/H+1TUckqzfI6QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wNy0wN1QxNjoyNToxOCswMjowMLU2pG0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDctMDdUMTY6MjU6MTgrMDI6MDDEaxzRAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==";
	public filtro :string;

	public pedidoDTO : PedidoDTO;
	public usuarioDTO :UsuarioDTO;

	public listaProductos = new Array<ProductoDTO>();
	public listaPresentacionesProducto = new Array<PresentacionProductoDTO>();
	public listaCategoriasProducto = new Array<CategoriaProductoDTO>();
	public listaLineasProducto = new Array<LineaProductoDTO>();

	public listaProductosFiltro = new Array<ProductoDTO>();

	public jsonInputProducto = new jsonInput(this.storage.get("token"), ValoresGlobales.R_PUBLICO);
	public jsonInputPresentacionProducto = new jsonInput(this.storage.get("token"), ValoresGlobales.R_PUBLICO);
	public jsonInputCategoriaProducto = new jsonInput(this.storage.get("token"), ValoresGlobales.R_PUBLICO);
	public jsonInputLineaProducto = new jsonInput(this.storage.get("token"), ValoresGlobales.R_PUBLICO);

	public jsonOutput = new jsonOutput();

	constructor(private _productoService: ProductoService,
		private _presentacionProductoService: PresentacionProductoService,
		private _categoriaProductoService: CategoriaProductoService,
		private _lineaProductoService: LineaProductoService,
		@Inject(SESSION_STORAGE) private storage:StorageService, 
		private router: Router){
		this.cargarProductos();
		AppComponent.modal = false;
	}

	ngOnInit(){
		AppComponent.modal=true;
		this.usuarioDTO = this.storage.get("usuario")?this.storage.get("usuario").UsuarioDTO:null;
		if(this.storage.get("pedido") == undefined){
			this.pedidoDTO = this.crearPedido();
			this.storage.set("pedido", this.pedidoDTO );
		}else{
			this.pedidoDTO = this.storage.get("pedido");
		}

		
		this.cargarPresentacionesProducto();
		this.cargarCategoriasProducto();
		this.cargarLineasProducto();
	}

	cargarProductos(){
		this.jsonInputProducto.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PRODUCTOS_001;

		this._productoService.consultarTodos( this.jsonInputProducto )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaProductos.push(value.ProductoDTO);
				this.listaProductosFiltro.push(value.ProductoDTO);
			}); 

		});	
	}

	cargarPresentacionesProducto(){
		this.listaPresentacionesProducto = new Array<PresentacionProductoDTO>();
		this.jsonInputPresentacionProducto.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_PRESENTACIONES_PRODUCTO_001;

		this._presentacionProductoService.consultarTodos( this.jsonInputPresentacionProducto )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaPresentacionesProducto.push(value.PresentacionProductoDTO);
			}); 

		});	
	}

	cargarCategoriasProducto(){
		this.listaCategoriasProducto = new Array<CategoriaProductoDTO>();
		this.jsonInputCategoriaProducto.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_CATEGORIAS_PRODUCTO_001;

		this._categoriaProductoService.consultarTodos( this.jsonInputCategoriaProducto )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaCategoriasProducto.push(value.CategoriaProductoDTO);
			}); 

		});	
	}

	cargarLineasProducto(){
		this.listaLineasProducto = new Array<LineaProductoDTO>();
		this.jsonInputLineaProducto.headerInput.transaccion = ValoresGlobales.S_CONSULTAR_LINEAS_PRODUCTO_001;

		this._lineaProductoService.consultarTodos( this.jsonInputLineaProducto )
		.subscribe(response =>{

			this.jsonOutput = response;
			this.jsonOutput.bodyOutput.data.forEach(value => {
				this.listaLineasProducto.push(value.LineaProductoDTO);
			}); 
			AppComponent.modal = false;
		});	
	}

	agregarItem(producto : ProductoDTO){

		if(producto.stock == 0){
			alert("Producto no disponible por el momento...");
			return;
		}

		let indexDetalle = this.pedidoDTO.detallesPedido.findIndex(
										i => i.DetallePedidoDTO.producto.ProductoDTO.idProducto == producto.idProducto);
		//alert(indexDetalle);
		if( indexDetalle == -1 ){
			let detallePedido = new DetallesPedidoDTO();
			detallePedido.descripcion = producto.nombre;
			detallePedido.cantidad = 1;
			detallePedido.precioUnitario = producto.precio ;
			detallePedido.total = detallePedido.precioUnitario;
			detallePedido.producto = {ProductoDTO: producto};
			this.pedidoDTO.detallesPedido.push({DetallePedidoDTO: detallePedido} );
		}else{
			let cantidad = this.pedidoDTO.detallesPedido[indexDetalle].DetallePedidoDTO.cantidad + 1;
			let precioUnitario = this.pedidoDTO.detallesPedido[indexDetalle].DetallePedidoDTO.precioUnitario;
			let total = parseFloat((cantidad*precioUnitario).toFixed(2));

			this.pedidoDTO.detallesPedido[indexDetalle].DetallePedidoDTO.cantidad = cantidad;
			this.pedidoDTO.detallesPedido[indexDetalle].DetallePedidoDTO.total = total ;
		}

		this.listaProductos.find(p=>p.idProducto == producto.idProducto).stock = producto.stock-1;

		this.calcularPedido();
		
		this.storage.set("pedido", this.pedidoDTO);

		AppComponent.numeroItemsCarrito = this.pedidoDTO.detallesPedido.map((detalle)=>detalle.DetallePedidoDTO.cantidad).reduce((a, b)=> a+b,0);
	}
	
	crearPedido(){
		let pedidoDTO = new PedidoDTO();
		if(this.usuarioDTO != null){
			pedidoDTO.direccion = this.usuarioDTO.direccion;
			pedidoDTO.telefono = this.usuarioDTO.telefono;
			pedidoDTO.cliente = {UsuarioDTO:this.usuarioDTO};
		}

		pedidoDTO.fecha = new Date();
		pedidoDTO.detallesPedido = new Array<DetallesPedidoDTO>();
		pedidoDTO.subtotal = 0.00;
		pedidoDTO.iva = 0.00;
		pedidoDTO.total = 0.00;

		return pedidoDTO;
	}

	calcularPedido(){
		let subtotal:number = 0.00;
		let iva= 0.00;
		let total = 0.00;

		this.pedidoDTO.detallesPedido.forEach(value =>{
			let detallePedido = value.DetallePedidoDTO;
			subtotal += parseFloat(detallePedido.total); 
		});

		this.pedidoDTO.subtotal = parseFloat(subtotal.toFixed(2));
		this.pedidoDTO.iva = parseFloat((subtotal * 0.12).toFixed(2));
		this.pedidoDTO.total = parseFloat((this.pedidoDTO.subtotal+this.pedidoDTO.iva).toFixed(2));
	}

	buscarProducto(){

		this.listaProductosFiltro = this.listaProductos
									.filter(p=>
											p.nombre.toLowerCase().indexOf(this.filtro.toLowerCase()) > -1);
	}

	filtarPresentacion(presentacionProducto : PresentacionProductoDTO){
		this.listaProductosFiltro = this.listaProductos
									.filter(p=>
											p.presentacionProducto == presentacionProducto.idPresentacionProducto);
											
	}

	filtarCategoria(categoriaProducto : CategoriaProductoDTO){
		this.listaProductosFiltro = this.listaProductos
									.filter(p=>
											p.categoriaProducto == categoriaProducto.idCategoriaProducto);
											
	}

	filtarLinea(lineaProducto : LineaProductoDTO){
		this.listaProductosFiltro = this.listaProductos
									.filter(p=>
											p.lineaProducto == lineaProducto.idLineaProducto);
		
	}

}